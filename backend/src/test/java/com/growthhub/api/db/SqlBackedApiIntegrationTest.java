package com.growthhub.api.db;

import com.growthhub.api.analytics.AnalyticsService;
import com.growthhub.api.analytics.dto.FunnelStageResponse;
import com.growthhub.api.analytics.dto.FunnelSummaryResponse;
import com.growthhub.api.campaign.Campaign;
import com.growthhub.api.campaign.CampaignRepository;
import com.growthhub.api.campaign.CampaignTestFixtures;
import com.growthhub.api.campaign.ChannelRepository;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.tracking.EventRepository;
import com.growthhub.api.tracking.EventService;
import com.growthhub.api.tracking.dto.EventRequest;
import com.growthhub.api.user.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Ejecuta el backend contra el esquema SQL real (base-de-datos-mvp.sql) en H2.
 * Hibernate solo valida el mapping (ddl-auto=validate); las tablas las crea el
 * propio script SQL. NON_KEYWORDS=KEY es necesario porque H2 2.x trata la
 * columna "key" de funnel_stages como palabra reservada.
 */
@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:sql_backed_api;DB_CLOSE_DELAY=-1;NON_KEYWORDS=KEY",
		"spring.sql.init.mode=always",
		"spring.sql.init.schema-locations=file:db/base-de-datos-mvp.sql",
		"spring.jpa.hibernate.ddl-auto=validate",
		"spring.jpa.defer-datasource-initialization=false"
})
@Transactional
class SqlBackedApiIntegrationTest {

	@Autowired
	private CampaignRepository campaignRepository;

	@Autowired
	private ChannelRepository channelRepository;

	@Autowired
	private EventRepository eventRepository;

	@Autowired
	private EventService eventService;

	@Autowired
	private UserService userService;

	@Autowired
	private AnalyticsService analyticsService;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Test
	void jpaWorksAgainstSqlSchema() {
		Campaign campaign = CampaignTestFixtures.createCampaign(
				campaignRepository, channelRepository, "Campaña SQL", "Email");

		eventService.registerEvent(new EventRequest(
				"sql-user", "visita", "Email", campaign.getId(), LocalDate.of(2026, 1, 10)));

		eventRepository.flush();

		assertThat(userService.getUser("sql-user").currentStage()).isEqualTo(FunnelStage.VISITA);

		FunnelSummaryResponse funnel = analyticsService.getFunnel();
		assertThat(usersAt(funnel, FunnelStage.VISITA)).isEqualTo(1);

		String stage = jdbcTemplate.queryForObject(
				"select stage from funnel_events where user_id = ?", String.class, "sql-user");
		assertThat(stage).isEqualTo("visita");
	}

	private long usersAt(FunnelSummaryResponse funnel, FunnelStage stage) {
		return funnel.stages().stream()
				.filter(item -> item.stage() == stage)
				.findFirst()
				.map(FunnelStageResponse::users)
				.orElseThrow();
	}
}