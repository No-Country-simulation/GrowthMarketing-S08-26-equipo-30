package com.growthhub.api.tracking;

import com.growthhub.api.campaign.Campaign;
import com.growthhub.api.campaign.CampaignRepository;
import com.growthhub.api.campaign.CampaignTestFixtures;
import com.growthhub.api.campaign.ChannelRepository;
import com.growthhub.api.exception.BadRequestException;
import com.growthhub.api.exception.NotFoundException;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.tracking.dto.EventRequest;
import com.growthhub.api.tracking.dto.EventResponse;
import com.growthhub.api.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class EventServiceTest {

	@Autowired
	private EventService eventService;

	@Autowired
	private CampaignRepository campaignRepository;

	@Autowired
	private ChannelRepository channelRepository;

	@Autowired
	private UserRepository userRepository;

	private Campaign seedCampaign() {
		return CampaignTestFixtures.createCampaign(
				campaignRepository, channelRepository, "Campaña evento", "Email");
	}

	@Test
	void registersValidEvent() {
		Campaign campaign = seedCampaign();

		EventResponse response = eventService.registerEvent(new EventRequest(
				"u01", "visita", "Email", campaign.getId(), LocalDate.of(2026, 1, 10)));

		assertThat(response.id()).isNotNull();
		assertThat(response.stage()).isEqualTo(FunnelStage.VISITA);
		assertThat(response.userId()).isEqualTo("u01");
		assertThat(userRepository.findById("u01")).isPresent();
	}

	@Test
	void rejectsNonexistentCampaign() {
		seedCampaign();

		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"u02", "visita", "Email", "campana-inexistente", LocalDate.of(2026, 1, 10))))
				.isInstanceOf(NotFoundException.class);
	}

	@Test
	void rejectsInvalidStage() {
		Campaign campaign = seedCampaign();

		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"u03", "etapa_invalida", "Email", campaign.getId(), LocalDate.of(2026, 1, 10))))
				.isInstanceOf(BadRequestException.class);
	}
}