package com.growthhub.api.tracking.dto;

import com.growthhub.api.shared.FunnelStage;

import java.time.LocalDate;

public record EventResponse(
		Long id,
		String userId,
		FunnelStage stage,
		String channelName,
		String campaignId,
		LocalDate eventDate) {
}