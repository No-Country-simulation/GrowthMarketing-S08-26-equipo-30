package com.growthhub.api.campaign;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;
//tabla intermedia. une campaña específica con un canal específico y,
// además, guarda la posición que tiene ese canal dentro de la campaña.
@Entity
@Table(
        name = "campaign_channels",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_campaign_channels_position", columnNames = {"campaign_id", "position"})
        }
)
@Check(constraints = "position >= 0") // Constraint de Hibernate para el CHECK
@Getter
@Setter
@NoArgsConstructor
public class CampaignChannel {

    @EmbeddedId
    private CampaignChannelId id = new CampaignChannelId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("campaignId") // Mapea el id de la campaña en la clave compuesta
    @JoinColumn(name = "campaign_id", nullable = false, foreignKey = @ForeignKey(name = "fk_campaign_channels_campaign"))
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("channelId") // Mapea el id del canal en la clave compuesta
    @JoinColumn(name = "channel_id", nullable = false, foreignKey = @ForeignKey(name = "fk_campaign_channels_channel"))
    private Channel channel;

    @Column(nullable = false)
    private Integer position;

    // Constructor custom para facilitar la creación
    public CampaignChannel(Campaign campaign, Channel channel, Integer position) {
        this.campaign = campaign;
        this.channel = channel;
        this.position = position;
    }
}