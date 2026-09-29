package com.growthhub.api.campaign.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CampaignRequest(
		@NotBlank String name,
		@NotBlank String objective,
		@NotNull @DecimalMin("0.00") BigDecimal budget,
		@NotNull LocalDate startDate,
		@NotNull LocalDate endDate,
		@NotEmpty List<Long> channelIds) {
}
