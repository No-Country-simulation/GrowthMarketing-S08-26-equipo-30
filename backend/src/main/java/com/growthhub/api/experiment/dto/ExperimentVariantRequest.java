package com.growthhub.api.experiment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ExperimentVariantRequest(
		@NotBlank(message = "El código de la variante es obligatorio")
		@Pattern(regexp = "^[AB]$", message = "El código de la variante debe ser 'A' o 'B'")
		String code,

		@NotBlank(message = "La descripción de la variante es obligatoria")
		String description) {
}