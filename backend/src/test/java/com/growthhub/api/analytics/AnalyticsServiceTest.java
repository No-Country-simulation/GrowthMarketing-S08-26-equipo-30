package com.growthhub.api.analytics;

import com.growthhub.api.analytics.dto.FunnelStageResponse;
import com.growthhub.api.analytics.dto.FunnelSummaryResponse;
import com.growthhub.api.analytics.dto.SegmentResponse;
import com.growthhub.api.campaign.Campaign;
import com.growthhub.api.campaign.CampaignRepository;
import com.growthhub.api.campaign.CampaignTestFixtures;
import com.growthhub.api.campaign.ChannelRepository;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.tracking.EventService;
import com.growthhub.api.tracking.dto.EventRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class AnalyticsServiceTest {

	@Autowired
	private AnalyticsService analyticsService;

	@Autowired
	private CampaignRepository campaignRepository;

	@Autowired
	private ChannelRepository channelRepository;

	@Autowired
	private EventService eventService;

	private String campaignId;

	@BeforeEach
	void setUp() {
		Campaign campaign = CampaignTestFixtures.createCampaign(
				campaignRepository, channelRepository, "Campaña analytics", "Email", "Google Ads");
		campaignId = campaign.getId();

		event("u1", "visita", "Email", 1);
		event("u1", "registro", "Email", 2);
		event("u1", "activacion", "Email", 3);

		event("u2", "visita", "Google Ads", 1);
		event("u2", "registro", "Google Ads", 2);

		event("u3", "visita", "Email", 1);
	}

	private void event(String userId, String stage, String channel, int day) {
		eventService.registerEvent(new EventRequest(
				userId, stage, channel, campaignId, LocalDate.of(2026, 1, day)));
	}

	@Test
	void calculatesSixStages() {
		FunnelSummaryResponse funnel = analyticsService.getFunnel();

		assertThat(funnel.stages()).hasSize(6);
		assertThat(funnel.stages()).extracting(FunnelStageResponse::stage)
				.containsExactly(FunnelStage.values());
		assertThat(usersAt(funnel, FunnelStage.VISITA)).isEqualTo(3);
		assertThat(usersAt(funnel, FunnelStage.REGISTRO)).isEqualTo(2);
		assertThat(usersAt(funnel, FunnelStage.ACTIVACION)).isEqualTo(1);
		assertThat(usersAt(funnel, FunnelStage.RETENCION)).isZero();
	}

	@Test
	void calculatesBottleneck() {
		FunnelSummaryResponse funnel = analyticsService.getFunnel();

		assertThat(funnel.bottleneck()).isEqualTo(FunnelStage.ACTIVACION);
		assertThat(funnel.bottleneckDrop()).isEqualTo(100.0);
	}

	@Test
	void calculatesSegmentsByCurrentStageAndFirstChannel() {
		List<SegmentResponse> segments = analyticsService.getSegments();

		assertThat(segments).hasSize(3);
		assertThat(segments).anySatisfy(segment -> {
			assertThat(segment.stage()).isEqualTo(FunnelStage.ACTIVACION);
			assertThat(segment.channelName()).isEqualTo("Email");
			assertThat(segment.users()).isEqualTo(1);
		});
		assertThat(segments).anySatisfy(segment -> {
			assertThat(segment.stage()).isEqualTo(FunnelStage.REGISTRO);
			assertThat(segment.channelName()).isEqualTo("Google Ads");
		});
		assertThat(segments).anySatisfy(segment -> {
			assertThat(segment.stage()).isEqualTo(FunnelStage.VISITA);
			assertThat(segment.channelName()).isEqualTo("Email");
		});
	}

	@Test
	void doesNotDuplicateUsersByRepeatedEvents() {
		event("u1", "visita", "Email", 4);
		event("u1", "visita", "Email", 5);

		FunnelSummaryResponse funnel = analyticsService.getFunnel();
		assertThat(usersAt(funnel, FunnelStage.VISITA)).isEqualTo(3);
		assertThat(usersAt(funnel, FunnelStage.REGISTRO)).isEqualTo(2);

		List<SegmentResponse> segments = analyticsService.getSegments();
		assertThat(segments).filteredOn(segment -> segment.stage() == FunnelStage.ACTIVACION)
				.allSatisfy(segment -> assertThat(segment.users()).isEqualTo(1));
	}

	@Test
	void segmentUsesFirstEventChannelOnDateTie() {
		event("u-tie", "visita", "Email", 6);
		event("u-tie", "registro", "Google Ads", 6);

		List<SegmentResponse> segments = analyticsService.getSegments();

		assertThat(segments).anySatisfy(segment -> {
			assertThat(segment.stage()).isEqualTo(FunnelStage.REGISTRO);
			assertThat(segment.channelName()).isEqualTo("Email");
		});
	}

	private long usersAt(FunnelSummaryResponse funnel, FunnelStage stage) {
		return funnel.stages().stream()
				.filter(item -> item.stage() == stage)
				.findFirst()
				.orElseThrow()
				.users();
	}
}