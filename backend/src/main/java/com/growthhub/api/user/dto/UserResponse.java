package com.growthhub.api.user.dto;

import com.growthhub.api.shared.FunnelStage;

public record UserResponse(String id, boolean demo, FunnelStage currentStage) {
}