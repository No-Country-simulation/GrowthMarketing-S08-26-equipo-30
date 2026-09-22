package com.growthhub.api.campaign;

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
public class CampaignChannelId implements Serializable {

    @Column(name = "campaign_id", columnDefinition = "CHAR(32)")
    private String campaignId;

    @Column(name = "channel_id")
    private Long channelId;
}