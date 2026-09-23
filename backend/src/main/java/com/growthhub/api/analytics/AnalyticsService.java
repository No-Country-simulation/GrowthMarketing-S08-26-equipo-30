package com.growthhub.api.analytics;

import com.growthhub.api.analytics.dto.FunnelStageResponse;
import com.growthhub.api.analytics.dto.FunnelSummaryResponse;
import com.growthhub.api.analytics.dto.SegmentResponse;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.tracking.Event;
import com.growthhub.api.tracking.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

	private final EventRepository eventRepository;

	public AnalyticsService(EventRepository eventRepository) {
		this.eventRepository = eventRepository;
	}

	@Transactional(readOnly = true)
	public FunnelSummaryResponse getFunnel() {
		FunnelStage[] stages = FunnelStage.values();
		long[] users = new long[stages.length];
		for (int i = 0; i < stages.length; i++) {
			users[i] = eventRepository.findDistinctUserIdsByStage(stages[i]).size();
		}

		List<FunnelStageResponse> responses = new ArrayList<>();
		for (int i = 0; i < stages.length; i++) {
			Double advanceRate = null;
			if (i < stages.length - 1) {
				advanceRate = users[i] == 0 ? 0.0 : (users[i + 1] * 100.0) / users[i];
			}
			responses.add(new FunnelStageResponse(
					stages[i],
					label(stages[i]),
					i + 1,
					users[i],
					advanceRate));
		}

		FunnelStage bottleneck = null;
		double biggestDrop = -1.0;
		for (int i = 0; i < stages.length - 1; i++) {
			if (users[i] == 0) {
				continue;
			}
			double drop = ((users[i] - users[i + 1]) * 100.0) / users[i];
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

	@Transactional(readOnly = true)
	public List<SegmentResponse> getSegments() {
		List<Event> events = eventRepository.findAllOrdered();
		Map<String, Event> firstEventByUser = new LinkedHashMap<>();
		Map<String, FunnelStage> currentStageByUser = new LinkedHashMap<>();

		for (Event event : events) {
			String userId = event.getUser().getId();
			firstEventByUser.putIfAbsent(userId, event);
			currentStageByUser.merge(userId, event.getStage(),
					(current, candidate) -> candidate.ordinal() > current.ordinal() ? candidate : current);
		}

		Map<String, SegmentResponse> grouped = new LinkedHashMap<>();
		for (Map.Entry<String, FunnelStage> entry : currentStageByUser.entrySet()) {
			String userId = entry.getKey();
			FunnelStage stage = entry.getValue();
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