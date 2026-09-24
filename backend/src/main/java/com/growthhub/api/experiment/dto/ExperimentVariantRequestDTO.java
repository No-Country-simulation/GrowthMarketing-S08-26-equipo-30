package com.growthhub.api.experiment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ExperimentVariantRequestDTO {

    @NotBlank(message = "El código de la variante es obligatorio")
    @Pattern(regexp = "^[AB]$", message = "El código debe ser 'A' o 'B'")
    private String code;

    @NotBlank(message = "La descripción es obligatoria")
    private String description;
}