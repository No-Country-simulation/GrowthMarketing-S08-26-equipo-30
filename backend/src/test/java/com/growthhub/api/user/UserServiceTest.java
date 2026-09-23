package com.growthhub.api.user;

import com.growthhub.api.campaign.Campaign;
import com.growthhub.api.campaign.CampaignRepository;
import com.growthhub.api.campaign.CampaignTestFixtures;
import com.growthhub.api.campaign.ChannelRepository;
import com.growthhub.api.exception.NotFoundException;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.tracking.EventService;
import com.growthhub.api.tracking.dto.EventRequest;
import com.growthhub.api.user.dto.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class UserServiceTest {

	@Autowired
	private UserService userService;

	@Autowired
	private UserRepository userRepository;

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
				campaignRepository, channelRepository, "Campaña users", "Email");
		campaignId = campaign.getId();

		eventService.registerEvent(new EventRequest(
				"u1", "visita", "Email", campaignId, LocalDate.of(2026, 1, 1)));
		eventService.registerEvent(new EventRequest(
				"u1", "registro", "Email", campaignId, LocalDate.of(2026, 1, 2)));
	}

	@Test
	void listsUsersWithCurrentStage() {
		List<UserResponse> users = userService.listUsers();

		assertThat(users).anySatisfy(user -> {
			assertThat(user.id()).isEqualTo("u1");
			assertThat(user.currentStage()).isEqualTo(FunnelStage.REGISTRO);
		});
	}

	@Test
	void returnsUserById() {
		UserResponse user = userService.getUser("u1");

		assertThat(user.id()).isEqualTo("u1");
		assertThat(user.currentStage()).isEqualTo(FunnelStage.REGISTRO);
	}

	@Test
	void returns404ForNonexistentUser() {
		assertThatThrownBy(() -> userService.getUser("inexistente"))
				.isInstanceOf(NotFoundException.class);
	}

	@Test
	void userWithoutEventsHasNullCurrentStage() {
		User user = new User();
		user.setId("sin-eventos");
		user.setDemo(false);
		userRepository.save(user);

		UserResponse response = userService.getUser("sin-eventos");

		assertThat(response.currentStage()).isNull();
	}

	@Test
	void outOfOrderEventsResolveToMostAdvancedStage() {
		eventService.registerEvent(new EventRequest(
				"u-oo", "registro", "Email", campaignId, LocalDate.of(2026, 1, 3)));
		eventService.registerEvent(new EventRequest(
				"u-oo", "visita", "Email", campaignId, LocalDate.of(2026, 1, 1)));

		UserResponse user = userService.getUser("u-oo");

		assertThat(user.currentStage()).isEqualTo(FunnelStage.REGISTRO);
	}

	@Test
	void repeatedEventsKeepMostAdvancedStage() {
		eventService.registerEvent(new EventRequest(
				"u-rep", "visita", "Email", campaignId, LocalDate.of(2026, 1, 1)));
		eventService.registerEvent(new EventRequest(
				"u-rep", "registro", "Email", campaignId, LocalDate.of(2026, 1, 2)));
		eventService.registerEvent(new EventRequest(
				"u-rep", "visita", "Email", campaignId, LocalDate.of(2026, 1, 3)));

		UserResponse user = userService.getUser("u-rep");

		assertThat(user.currentStage()).isEqualTo(FunnelStage.REGISTRO);
	}

	@Test
	void listsUsersWithAndWithoutEvents() {
		User lonely = new User();
		lonely.setId("sin-eventos-list");
		lonely.setDemo(false);
		userRepository.save(lonely);

		List<UserResponse> users = userService.listUsers();

		assertThat(users).anySatisfy(user -> {
			assertThat(user.id()).isEqualTo("u1");
			assertThat(user.currentStage()).isEqualTo(FunnelStage.REGISTRO);
		});
		assertThat(users).anySatisfy(user -> {
			assertThat(user.id()).isEqualTo("sin-eventos-list");
			assertThat(user.currentStage()).isNull();
		});
	}
}