package com.growthhub.api.campaign;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campaigns")
@Getter
@Setter
@NoArgsConstructor
public class Campaign {

    @Id
    @Column(length = 32, columnDefinition = "CHAR(32)", nullable = false)
    private String id;

    // ... (aquí irían nombre, presupuesto, fecha inicio/fin, etc)

    // Relación bidireccional hacia la tabla intermedia
    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CampaignChannel> campaignChannels = new ArrayList<>();

    // Método helper para mantener la sincronización bidireccional
    public void addChannel(Channel channel, Integer position) {
        CampaignChannel campaignChannel = new CampaignChannel(this, channel, position);
        this.campaignChannels.add(campaignChannel);
    }
}