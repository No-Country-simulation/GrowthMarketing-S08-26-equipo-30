package com.growthhub.api.analytics;

import com.growthhub.api.analytics.dto.FunnelStageResponse;
import com.growthhub.api.analytics.dto.FunnelSummaryResponse;
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

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class AnalyticsAdvanceRateTest {

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
				campaignRepository, channelRepository, "Campaña rates", "Email");
		campaignId = campaign.getId();

		event("u1", "visita", 1);
		event("u1", "registro", 2);
		event("u2", "registro", 3);
		event("u3", "visita", 1);
	}

	private void event(String userId, String stage, int day) {
		eventService.registerEvent(new EventRequest(
				userId, stage, "Email", campaignId, LocalDate.of(2026, 1, day)));
	}

	@Test
	void registroSinVisitaNoCuentaComoAvance() {
		FunnelSummaryResponse funnel = analyticsService.getFunnel();

		assertThat(usersAt(funnel, FunnelStage.VISITA)).isEqualTo(2);
		assertThat(usersAt(funnel, FunnelStage.REGISTRO)).isEqualTo(2);

		assertThat(advanceRateAt(funnel, FunnelStage.VISITA)).isEqualTo(50.0);
	}

	@Test
	void ultimaEtapaTieneTasaNull() {
		FunnelSummaryResponse funnel = analyticsService.getFunnel();

		assertThat(advanceRateAt(funnel, FunnelStage.RETENCION)).isNull();
	}

	@Test
	void etapaSinUsuariosTieneTasaCero() {
		FunnelSummaryResponse funnel = analyticsService.getFunnel();

		assertThat(advanceRateAt(funnel, FunnelStage.ACTIVACION)).isZero();
	}

	@Test
	void eventosRepetidosNoAlteranTasas() {
		event("u3", "visita", 4);
		event("u1", "registro", 5);

		FunnelSummaryResponse funnel = analyticsService.getFunnel();

		assertThat(usersAt(funnel, FunnelStage.VISITA)).isEqualTo(2);
		assertThat(usersAt(funnel, FunnelStage.REGISTRO)).isEqualTo(2);
		assertThat(advanceRateAt(funnel, FunnelStage.VISITA)).isEqualTo(50.0);
	}

	private long usersAt(FunnelSummaryResponse funnel, FunnelStage stage) {
		return funnel.stages().stream()
				.filter(item -> item.stage() == stage)
				.findFirst()
				.orElseThrow()
				.users();
	}

	private Double advanceRateAt(FunnelSummaryResponse funnel, FunnelStage stage) {
		return funnel.stages().stream()
				.filter(item -> item.stage() == stage)
				.findFirst()
				.orElseThrow()
				.advanceRate();
	}
}