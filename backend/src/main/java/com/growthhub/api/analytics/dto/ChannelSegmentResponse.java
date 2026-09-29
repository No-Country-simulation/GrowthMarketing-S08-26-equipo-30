package com.growthhub.api.analytics.dto;

public record ChannelSegmentResponse(Long channelId, String channelName, long users, double percentage) {
}
