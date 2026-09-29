package com.growthhub.api.analytics;

import com.growthhub.api.analytics.dto.ChannelSegmentResponse;
import com.growthhub.api.analytics.dto.FunnelStageResponse;
import com.growthhub.api.analytics.dto.FunnelSummaryResponse;
import com.growthhub.api.analytics.dto.SegmentResponse;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.shared.FunnelStageResolver;
import com.growthhub.api.tracking.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
		return getFunnel(null, null, null);
	}

	@Transactional(readOnly = true)
	public FunnelSummaryResponse getFunnel(LocalDate from, LocalDate to, Long channelId) {
		Cohort cohort = buildCohort(from, to, channelId);
		FunnelStage[] stages = FunnelStage.values();
		long[] users = new long[stages.length];
		Double[] rates = new Double[stages.length];
		Map<FunnelStage, Map<String, Long>> segmentCounts = new EnumMap<>(FunnelStage.class);

		for (UserPath path : cohort.paths().values()) {
			for (FunnelStage stage : path.stages()) {
				users[stage.ordinal()]++;
			}
			FunnelStage current = funnelStageResolver.currentStage(path.stages());
			String key = path.channelId() + "|" + path.channelName();
			segmentCounts.computeIfAbsent(current, ignored -> new LinkedHashMap<>()).merge(key, 1L, Long::sum);
		}
		for (int i = 0; i < stages.length; i++) {
			if (i == stages.length - 1) {
				rates[i] = null;
			} else if (users[i] == 0) {
				rates[i] = 0.0;
			} else {
				long both = countUsersWithBoth(stages[i], stages[i + 1], cohort.paths());
				rates[i] = both * 100.0 / users[i];
			}
		}

		List<FunnelStageResponse> responses = new ArrayList<>();
		for (int i = 0; i < stages.length; i++) {
			responses.add(new FunnelStageResponse(stages[i], label(stages[i]), i + 1, users[i], rates[i],
					toChannelSegments(segmentCounts.getOrDefault(stages[i], Map.of()), users[i])));
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
		return new FunnelSummaryResponse(responses, bottleneck, bottleneck == null ? null : biggestDrop);
	}

	@Transactional(readOnly = true)
	public List<SegmentResponse> getSegments() {
		return getSegments(null, null, null);
	}

	@Transactional(readOnly = true)
	public List<SegmentResponse> getSegments(LocalDate from, LocalDate to, Long channelId) {
		Cohort cohort = buildCohort(from, to, channelId);
		Map<String, SegmentResponse> grouped = new LinkedHashMap<>();
		for (UserPath path : cohort.paths().values()) {
			FunnelStage stage = funnelStageResolver.currentStage(path.stages());
			String key = stage.name() + "|" + path.channelName();
			SegmentResponse existing = grouped.get(key);
			grouped.put(key, existing == null
					? new SegmentResponse(stage, path.channelName(), 1L)
					: new SegmentResponse(stage, path.channelName(), existing.users() + 1));
		}
		return new ArrayList<>(grouped.values());
	}

	private Cohort buildCohort(LocalDate from, LocalDate to, Long channelId) {
		Map<String, EventRepository.SegmentEventView> firstVisit = new LinkedHashMap<>();
		Map<String, UserPath> paths = new LinkedHashMap<>();
		boolean unfiltered = from == null && to == null && channelId == null;
		for (EventRepository.SegmentEventView event : eventRepository.findEventsForSegments()) {
			String userId = event.getUserId();
			if (unfiltered) {
				firstVisit.putIfAbsent(userId, event);
			} else if (event.getStage() == FunnelStage.VISITA) {
				firstVisit.putIfAbsent(userId, event);
			}
		}
		for (EventRepository.SegmentEventView event : eventRepository.findEventsForSegments()) {
			EventRepository.SegmentEventView first = firstVisit.get(event.getUserId());
			if (first == null || !matches(first, event, from, to, channelId)) {
				continue;
			}
			paths.computeIfAbsent(event.getUserId(), ignored -> new UserPath(first.getChannelId(), first.getChannelName(), new HashSet<>()))
					.stages().add(event.getStage());
		}
		return new Cohort(paths);
	}

	private boolean matches(EventRepository.SegmentEventView first, EventRepository.SegmentEventView event,
			LocalDate from, LocalDate to, Long channelId) {
		if (from != null && first.getEventDate().isBefore(from)) {
			return false;
		}
		if (to != null && first.getEventDate().isAfter(to)) {
			return false;
		}
		if (to != null && event.getEventDate().isAfter(to)) {
			return false;
		}
		return channelId == null || first.getChannelId().equals(channelId);
	}

	private long countUsersWithBoth(FunnelStage first, FunnelStage second, Map<String, UserPath> paths) {
		return paths.values().stream().filter(path -> path.stages().contains(first) && path.stages().contains(second)).count();
	}

	private List<ChannelSegmentResponse> toChannelSegments(Map<String, Long> counts, long total) {
		return counts.entrySet().stream().map(entry -> {
			String[] parts = entry.getKey().split("\\|", 2);
			double percentage = total == 0 ? 0.0 : entry.getValue() * 100.0 / total;
			return new ChannelSegmentResponse(Long.valueOf(parts[0]), parts[1], entry.getValue(), percentage);
		}).toList();
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

	private record Cohort(Map<String, UserPath> paths) {
	}

	private record UserPath(Long channelId, String channelName, Set<FunnelStage> stages) {
	}
}
