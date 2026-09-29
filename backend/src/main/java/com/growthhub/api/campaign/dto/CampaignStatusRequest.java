package com.growthhub.api.campaign.dto;

import com.growthhub.api.shared.CampaignStatus;
import jakarta.validation.constraints.NotNull;

public record CampaignStatusRequest(@NotNull CampaignStatus status) {
}
