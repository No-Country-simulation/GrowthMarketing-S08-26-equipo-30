package com.growthhub.api.experiment.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CloseExperimentRequest(
		@NotBlank(message = "El resultado es obligatorio")
		String result,

		String winnerCode,

		@NotBlank(message = "La conclusión es obligatoria")
		String conclusion,

		@NotEmpty(message = "Debe enviar las métricas de las variantes")
		@Valid
		List<ExperimentVariantMetricsRequest> variants) {
}