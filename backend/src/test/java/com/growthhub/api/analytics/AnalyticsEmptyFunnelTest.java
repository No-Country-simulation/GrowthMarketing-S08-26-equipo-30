package com.growthhub.api.analytics;

import com.growthhub.api.analytics.dto.FunnelStageResponse;
import com.growthhub.api.analytics.dto.FunnelSummaryResponse;
import com.growthhub.api.shared.FunnelStage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class AnalyticsEmptyFunnelTest {

	@Autowired
	private AnalyticsService analyticsService;

	@Test
	void emptyFunnelReturnsSixZeroStages() {
		FunnelSummaryResponse funnel = analyticsService.getFunnel();

		assertThat(funnel.stages()).hasSize(6);
		assertThat(funnel.stages()).extracting(FunnelStageResponse::stage)
				.containsExactly(FunnelStage.values());
		assertThat(funnel.stages()).allSatisfy(stage -> {
			assertThat(stage.users()).isZero();
			assertThat(stage.position()).isPositive();
		});
		assertThat(funnel.bottleneck()).isNull();
		assertThat(funnel.bottleneckDrop()).isNull();
	}
}