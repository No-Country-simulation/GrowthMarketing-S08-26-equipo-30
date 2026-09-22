package com.growthhub.api.campaign;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad principal que representa las campañas de marketing.
 */
@Entity
@Table(
        name = "campaigns",
        uniqueConstraints = {
                // Garantiza que la combinación de cuenta y campaña de Meta no se repita
                @UniqueConstraint(name = "uq_campaigns_meta_pair", columnNames = {"meta_account_id", "meta_campaign_id"})
        }
)
// Múltiples validaciones a nivel de base de datos basadas en tu SQL
@Check(constraints = "LENGTH(TRIM(name)) > 0")
@Check(constraints = "LENGTH(TRIM(objective)) > 0")
@Check(constraints = "budget >= 0")
@Check(constraints = "end_date >= start_date")
@Check(constraints = "status IN ('activa', 'pausada', 'finalizada')")
@Check(constraints = "(meta_account_id IS NULL AND meta_campaign_id IS NULL) OR (meta_account_id IS NOT NULL AND meta_campaign_id IS NOT NULL)")
@Getter
@Setter
@NoArgsConstructor
public class Campaign {

    @Id
    @Column(columnDefinition = "CHAR(32)", length = 32, nullable = false)
    private String id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String name;

    @Column(name = "name_key", columnDefinition = "TEXT", nullable = false, unique = true)
    private String nameKey;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String objective;

    // Se usa BigDecimal para manejar con exactitud valores monetarios
    @Column(precision = 18, scale = 2, nullable = false)
    private BigDecimal budget;

    // LocalDate para fechas sin hora
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(length = 20, nullable = false)
    private String status = "activa"; // Valor por defecto

    @Column(name = "is_demo", nullable = false)
    private Boolean isDemo = false; // Valor por defecto

    // LocalDateTime para guardar fecha y hora exacta
    @Column(name = "archived_at")
    private LocalDateTime archivedAt;

    @Column(name = "meta_account_id", length = 100)
    private String metaAccountId;

    @Column(name = "meta_campaign_id", length = 100)
    private String metaCampaignId;

    @Column(name = "last_sync_attempt_at")
    private LocalDateTime lastSyncAttemptAt;

    @Column(name = "last_sync_success_at")
    private LocalDateTime lastSyncSuccessAt;

    @Column(name = "last_sync_error", columnDefinition = "TEXT")
    private String lastSyncError;

    // Relación bidireccional hacia la tabla intermedia
    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CampaignChannel> campaignChannels = new ArrayList<>();

    /**
     * Método helper (Utility) para agregar canales a la campaña de forma segura,
     * manteniendo ambos lados de la relación sincronizados en memoria.
     */
    public void addChannel(Channel channel, Integer position) {
        CampaignChannel campaignChannel = new CampaignChannel(this, channel, position);
        this.campaignChannels.add(campaignChannel);
    }
}