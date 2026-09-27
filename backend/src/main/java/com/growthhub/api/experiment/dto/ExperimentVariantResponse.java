package com.growthhub.api.experiment.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record ExperimentVariantResponse(
		String code,
		String description,
		Long visits,
		Long registrations,
		Long activations,
		Long conversions,
		Long clicks,
		BigDecimal spend,
		Instant measuredAt) {
}