package com.growthhub.api.analytics.dto;

import com.growthhub.api.shared.FunnelStage;

public record FunnelStageResponse(
		FunnelStage stage,
		String label,
		int position,
		long users,
		Double advanceRate) {
}