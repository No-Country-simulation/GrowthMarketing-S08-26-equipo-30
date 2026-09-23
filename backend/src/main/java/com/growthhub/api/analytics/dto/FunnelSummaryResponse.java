package com.growthhub.api.analytics.dto;

import com.growthhub.api.shared.FunnelStage;

import java.util.List;

public record FunnelSummaryResponse(
		List<FunnelStageResponse> stages,
		FunnelStage bottleneck,
		Double bottleneckDrop) {
}