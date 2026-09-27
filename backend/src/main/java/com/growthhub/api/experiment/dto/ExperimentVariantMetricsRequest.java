package com.growthhub.api.experiment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.time.Instant;

public record ExperimentVariantMetricsRequest(
		@NotBlank(message = "El código de la variante es obligatorio")
		@Pattern(regexp = "^[AB]$", message = "El código de la variante debe ser 'A' o 'B'")
		String code,

		Long visits,
		Long registrations,
		Long activations,
		Long conversions,
		Long clicks,
		BigDecimal spend,
		Instant measuredAt) {
}