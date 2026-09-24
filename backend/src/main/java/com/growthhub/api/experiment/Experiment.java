package com.growthhub.api.experiment;

import com.growthhub.api.campaign.Campaign; // Importa tu entidad Campaign previamente creada
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "experiments",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_experiments_id_winner", columnNames = {"id", "winner_code"})
        }
)
@Check(constraints = "LENGTH(TRIM(name)) > 0")
@Check(constraints = "LENGTH(TRIM(hypothesis)) > 0")
@Check(constraints = "status IN ('borrador', 'activo', 'terminado', 'cancelado')")
@Check(constraints = "target_metric IN ('conversion_rate', 'activation_rate', 'customer_conversion_rate', 'cost_per_result')")
@Check(constraints = "winner_code IS NULL OR winner_code IN ('A', 'B')")
@Getter
@Setter
@NoArgsConstructor
public class Experiment {

    @Id
    @Column(columnDefinition = "CHAR(32)", length = 32, nullable = false)
    private String id;

    // Relación directa con la campaña
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false, foreignKey = @ForeignKey(name = "fk_experiments_campaign"))
    private Campaign campaign;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String hypothesis;

    @Column(name = "target_metric", length = 40, nullable = false)
    private String targetMetric;

    @Column(name = "result_type", length = 20)
    private String resultType;

    @Column(length = 20, nullable = false)
    private String status = "borrador";

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    // Se mapea como String simple para evitar conflictos de persistencia circular con las variantes
    @Column(name = "winner_code", columnDefinition = "CHAR(1)")
    private String winnerCode;

    @Column(columnDefinition = "TEXT")
    private String conclusion;

    // Relación bidireccional hacia las variantes del experimento
    @OneToMany(mappedBy = "experiment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExperimentVariant> variants = new ArrayList<>();

    public void addVariant(String code, String description) {
        ExperimentVariant variant = new ExperimentVariant(this, code, description);
        this.variants.add(variant);
    }
}