package com.growthhub.api.analytics.dto;

import com.growthhub.api.shared.FunnelStage;

public record SegmentResponse(
		FunnelStage stage,
		String channelName,
		long users) {
}