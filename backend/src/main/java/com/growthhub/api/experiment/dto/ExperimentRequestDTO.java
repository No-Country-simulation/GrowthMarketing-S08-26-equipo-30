package com.growthhub.api.experiment.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ExperimentRequestDTO {

    @NotBlank(message = "El ID de la campaña es obligatorio")
    private String campaignId;

    @NotBlank(message = "El nombre del experimento es obligatorio")
    private String name;

    @NotBlank(message = "La hipótesis es obligatoria")
    private String hypothesis;

    @NotBlank(message = "La métrica objetivo es obligatoria")
    private String targetMetric;

    private String resultType;

    @NotEmpty(message = "Debe enviar al menos las variantes del experimento")
    @Size(min = 2, max = 2, message = "Un experimento A/B debe tener exactamente 2 variantes")
    @Valid
    private List<ExperimentVariantRequestDTO> variants;
}