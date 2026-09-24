package com.growthhub.api.experiment;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "experiment_variants")
// Restricciones de negocio a nivel de base de datos extraídas de tu esquema
@Check(constraints = "code IN ('A', 'B')")
@Check(constraints = "LENGTH(TRIM(description)) > 0")
@Check(constraints = "visits IS NULL OR visits >= 0")
@Check(constraints = "registrations IS NULL OR visits IS NULL OR registrations <= visits")
@Check(constraints = "activations IS NULL OR registrations IS NULL OR activations <= registrations")
@Check(constraints = "conversions IS NULL OR activations IS NULL OR conversions <= activations")
@Getter
@Setter
@NoArgsConstructor
public class ExperimentVariant {

    @EmbeddedId
    private ExperimentVariantId id = new ExperimentVariantId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("experimentId")
    @JoinColumn(name = "experiment_id", nullable = false, foreignKey = @ForeignKey(name = "fk_experiment_variants_experiment"))
    private Experiment experiment;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private Long visits;
    private Long registrations;
    private Long activations;
    private Long conversions;
    private Long clicks;

    @Column(precision = 18, scale = 2)
    private BigDecimal spend;

    @Column(name = "measured_at")
    private LocalDateTime measuredAt;

    public ExperimentVariant(Experiment experiment, String code, String description) {
        this.experiment = experiment;
        this.id.setCode(code);
        this.description = description;
    }
}