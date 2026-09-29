package com.growthhub.api.campaign.dto;

import com.growthhub.api.shared.CampaignStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record CampaignResponse(
		String id,
		String name,
		String objective,
		BigDecimal budget,
		LocalDate startDate,
		LocalDate endDate,
		CampaignStatus status,
		Instant archivedAt,
		List<ChannelResponse> channels,
		long visits,
		long registrations,
		long customers,
		long retained) {
}
