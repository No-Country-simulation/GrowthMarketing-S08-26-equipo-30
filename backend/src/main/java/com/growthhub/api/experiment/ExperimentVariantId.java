package com.growthhub.api.experiment;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExperimentVariantId implements Serializable {

    @Column(name = "experiment_id", columnDefinition = "CHAR(32)")
    private String experimentId;

    @Column(name = "code", columnDefinition = "CHAR(1)")
    private String code;
}