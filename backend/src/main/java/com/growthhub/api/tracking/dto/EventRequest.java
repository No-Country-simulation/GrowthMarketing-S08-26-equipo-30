package com.growthhub.api.tracking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record EventRequest(
		@NotBlank String userId,
		@NotBlank String stage,
		@NotBlank String channelName,
		@NotBlank String campaignId,
		@NotNull LocalDate eventDate) {
}