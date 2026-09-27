package com.growthhub.api.experiment.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ExperimentRequest(
		@NotBlank(message = "El ID de la campaña es obligatorio")
		String campaignId,

		@NotBlank(message = "El nombre del experimento es obligatorio")
		String name,

		@NotBlank(message = "La hipótesis es obligatoria")
		String hypothesis,

		@NotBlank(message = "La métrica objetivo es obligatoria")
		String targetMetric,

		String resultType,

		@NotEmpty(message = "Debe enviar al menos las variantes del experimento")
		@Size(min = 2, max = 2, message = "Un experimento A/B debe tener exactamente 2 variantes")
		@Valid
		List<ExperimentVariantRequest> variants) {
}