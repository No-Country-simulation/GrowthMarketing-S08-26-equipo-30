package com.growthhub.api.analytics;

import com.growthhub.api.analytics.dto.FunnelSummaryResponse;
import com.growthhub.api.analytics.dto.SegmentResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

	private final AnalyticsService analyticsService;

	public AnalyticsController(AnalyticsService analyticsService) {
		this.analyticsService = analyticsService;
	}

	@GetMapping("/funnel")
	public FunnelSummaryResponse getFunnel() {
		return analyticsService.getFunnel();
	}

	@GetMapping("/segments")
	public List<SegmentResponse> getSegments() {
		return analyticsService.getSegments();
	}
}