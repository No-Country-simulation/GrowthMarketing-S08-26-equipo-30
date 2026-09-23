package com.growthhub.api.tracking;

import com.growthhub.api.campaign.Campaign;
import com.growthhub.api.campaign.CampaignRepository;
import com.growthhub.api.campaign.CampaignTestFixtures;
import com.growthhub.api.campaign.Channel;
import com.growthhub.api.campaign.ChannelRepository;
import com.growthhub.api.exception.BadRequestException;
import com.growthhub.api.exception.NotFoundException;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.tracking.dto.EventRequest;
import com.growthhub.api.tracking.dto.EventResponse;
import com.growthhub.api.user.User;
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
	private EventRepository eventRepository;

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
	void persistsExactlyOneEvent() {
		Campaign campaign = seedCampaign();
		long eventsBefore = eventRepository.count();

		eventService.registerEvent(new EventRequest(
				"u-persist", "visita", "Email", campaign.getId(), LocalDate.of(2026, 1, 10)));

		assertThat(eventRepository.count()).isEqualTo(eventsBefore + 1);
	}

	@Test
	void doesNotDuplicateExistingUser() {
		Campaign campaign = seedCampaign();
		User existing = new User();
		existing.setId("u-existente");
		existing.setDemo(true);
		userRepository.save(existing);
		long usersBefore = userRepository.count();

		eventService.registerEvent(new EventRequest(
				"u-existente", "registro", "Email", campaign.getId(), LocalDate.of(2026, 1, 10)));

		assertThat(userRepository.count()).isEqualTo(usersBefore);
		User user = userRepository.findById("u-existente").orElseThrow();
		assertThat(user.isDemo()).isTrue();
	}

	@Test
	void rejectsNonexistentCampaign() {
		seedCampaign();
		long eventsBefore = eventRepository.count();

		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"u02", "visita", "Email", "campana-inexistente", LocalDate.of(2026, 1, 10))))
				.isInstanceOf(NotFoundException.class);

		assertThat(eventRepository.count()).isEqualTo(eventsBefore);
	}

	@Test
	void rejectsInvalidStage() {
		Campaign campaign = seedCampaign();

		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"u03", "etapa_invalida", "Email", campaign.getId(), LocalDate.of(2026, 1, 10))))
				.isInstanceOf(BadRequestException.class);
	}

	@Test
	void rejectsNonexistentChannel() {
		Campaign campaign = seedCampaign();
		long eventsBefore = eventRepository.count();

		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"u04", "visita", "Canal inexistente", campaign.getId(), LocalDate.of(2026, 1, 10))))
				.isInstanceOf(NotFoundException.class);

		assertThat(eventRepository.count()).isEqualTo(eventsBefore);
	}

	@Test
	void rejectsChannelNotAssignedToCampaign() {
		Campaign campaign = seedCampaign();
		Channel foreign = new Channel();
		foreign.setName("Canal ajeno");
		channelRepository.save(foreign);
		long eventsBefore = eventRepository.count();

		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"u-ajeno", "visita", "Canal ajeno", campaign.getId(), LocalDate.of(2026, 1, 10))))
				.isInstanceOf(BadRequestException.class);

		assertThat(eventRepository.count()).isEqualTo(eventsBefore);
	}

	@Test
	void rejectsIncompleteRequest() {
		Campaign campaign = seedCampaign();

		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"", "visita", "Email", campaign.getId(), LocalDate.of(2026, 1, 10))))
				.isInstanceOf(BadRequestException.class);
		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"u05", "", "Email", campaign.getId(), LocalDate.of(2026, 1, 10))))
				.isInstanceOf(BadRequestException.class);
		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"u06", "visita", "", campaign.getId(), LocalDate.of(2026, 1, 10))))
				.isInstanceOf(BadRequestException.class);
		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"u07", "visita", "Email", "", LocalDate.of(2026, 1, 10))))
				.isInstanceOf(BadRequestException.class);
		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"u08", "visita", "Email", campaign.getId(), null)))
				.isInstanceOf(BadRequestException.class);
	}

	@Test
	void doesNotCreateNewChannels() {
		Campaign campaign = seedCampaign();
		long channelsBefore = channelRepository.count();

		assertThatThrownBy(() -> eventService.registerEvent(new EventRequest(
				"u09", "visita", "Canal nuevo", campaign.getId(), LocalDate.of(2026, 1, 10))))
				.isInstanceOf(NotFoundException.class);

		assertThat(channelRepository.count()).isEqualTo(channelsBefore);
	}
}