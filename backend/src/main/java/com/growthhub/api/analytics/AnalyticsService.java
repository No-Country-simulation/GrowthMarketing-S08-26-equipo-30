package com.growthhub.api.analytics;

import com.growthhub.api.analytics.dto.FunnelStageResponse;
import com.growthhub.api.analytics.dto.FunnelSummaryResponse;
import com.growthhub.api.analytics.dto.SegmentResponse;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.shared.FunnelStageResolver;
import com.growthhub.api.tracking.Event;
import com.growthhub.api.tracking.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class AnalyticsService {

	private final EventRepository eventRepository;
	private final FunnelStageResolver funnelStageResolver;

	public AnalyticsService(EventRepository eventRepository, FunnelStageResolver funnelStageResolver) {
		this.eventRepository = eventRepository;
		this.funnelStageResolver = funnelStageResolver;
	}

	@Transactional(readOnly = true)
	public FunnelSummaryResponse getFunnel() {
		FunnelStage[] stages = FunnelStage.values();
		long[] users = new long[stages.length];
		Double[] rates = new Double[stages.length];

		Map<FunnelStage, Long> counts = new EnumMap<>(FunnelStage.class);
		Map<String, Set<FunnelStage>> stagesByUser = new HashMap<>();
		for (Object[] row : eventRepository.findDistinctUserStages()) {
			stagesByUser.computeIfAbsent((String) row[0], key -> new HashSet<>()).add((FunnelStage) row[1]);
		}
		for (Set<FunnelStage> userStages : stagesByUser.values()) {
			for (FunnelStage stage : userStages) {
				counts.merge(stage, 1L, Long::sum);
			}
		}
		for (int i = 0; i < stages.length; i++) {
			users[i] = counts.getOrDefault(stages[i], 0L);
		}

		for (int i = 0; i < stages.length; i++) {
			if (i == stages.length - 1) {
				rates[i] = null;
			} else if (users[i] == 0) {
				rates[i] = 0.0;
			} else {
				long both = countUsersWithBoth(stages[i], stages[i + 1], stagesByUser);
				rates[i] = both * 100.0 / users[i];
			}
		}

		List<FunnelStageResponse> responses = new ArrayList<>();
		for (int i = 0; i < stages.length; i++) {
			responses.add(new FunnelStageResponse(
					stages[i],
					label(stages[i]),
					i + 1,
					users[i],
					rates[i]));
		}

		FunnelStage bottleneck = null;
		double biggestDrop = -1.0;
		for (int i = 0; i < stages.length - 1; i++) {
			if (users[i] == 0) {
				continue;
			}
			double drop = 100.0 - rates[i];
			if (drop > biggestDrop) {
				biggestDrop = drop;
				bottleneck = stages[i];
			}
		}

		return new FunnelSummaryResponse(
				responses,
				bottleneck,
				bottleneck == null ? null : biggestDrop);
	}

	private long countUsersWithBoth(FunnelStage first, FunnelStage second,
			Map<String, Set<FunnelStage>> stagesByUser) {
		long count = 0;
		for (Set<FunnelStage> userStages : stagesByUser.values()) {
			if (userStages.contains(first) && userStages.contains(second)) {
				count++;
			}
		}
		return count;
	}

	@Transactional(readOnly = true)
	public List<SegmentResponse> getSegments() {
		List<Event> events = eventRepository.findAllOrdered();
		Map<String, Event> firstEventByUser = new LinkedHashMap<>();
		Map<String, Set<FunnelStage>> stagesByUser = new LinkedHashMap<>();

		for (Event event : events) {
			String userId = event.getUser().getId();
			firstEventByUser.putIfAbsent(userId, event);
			stagesByUser.computeIfAbsent(userId, key -> new HashSet<>()).add(event.getStage());
		}

		Map<String, SegmentResponse> grouped = new LinkedHashMap<>();
		for (Map.Entry<String, Set<FunnelStage>> entry : stagesByUser.entrySet()) {
			String userId = entry.getKey();
			FunnelStage stage = funnelStageResolver.currentStage(entry.getValue());
			String channelName = firstEventByUser.get(userId).getChannel().getName();
			String key = stage.name() + "|" + channelName;
			SegmentResponse existing = grouped.get(key);
			if (existing == null) {
				grouped.put(key, new SegmentResponse(stage, channelName, 1L));
			} else {
				grouped.put(key, new SegmentResponse(stage, channelName, existing.users() + 1));
			}
		}

		return new ArrayList<>(grouped.values());
	}

	private String label(FunnelStage stage) {
		return switch (stage) {
			case VISITA -> "Visita";
			case REGISTRO -> "Registro";
			case ACTIVACION -> "Activación";
			case INTERACCION -> "Interacción";
			case CONVERSION -> "Conversión";
			case RETENCION -> "Retención";
		};
	}
}