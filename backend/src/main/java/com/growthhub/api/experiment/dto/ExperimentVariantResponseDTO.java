package com.growthhub.api.experiment.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ExperimentVariantResponseDTO {
    private String code;
    private String description;
    private Long visits;
    private Long registrations;
    private Long activations;
    private Long conversions;
    private Long clicks;
    private BigDecimal spend;
    private LocalDateTime measuredAt;
}