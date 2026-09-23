package com.growthhub.api;

import com.growthhub.api.campaign.Campaign;
import com.growthhub.api.campaign.CampaignRepository;
import com.growthhub.api.campaign.CampaignTestFixtures;
import com.growthhub.api.campaign.ChannelRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private CampaignRepository campaignRepository;

	@Autowired
	private ChannelRepository channelRepository;

	@Test
	void registersValidEventReturns201() throws Exception {
		Campaign campaign = CampaignTestFixtures.createCampaign(
				campaignRepository, channelRepository, "Campaña int valida", "Email");

		mockMvc.perform(post("/api/events")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
									"userId": "int-user",
									"stage": "visita",
									"channelName": "Email",
									"campaignId": "%s",
									"eventDate": "2026-01-10"
								}
								""".formatted(campaign.getId())))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").isNumber())
				.andExpect(jsonPath("$.stage").value("VISITA"));
	}

	@Test
	void rejectsInvalidStageWith400() throws Exception {
		Campaign campaign = CampaignTestFixtures.createCampaign(
				campaignRepository, channelRepository, "Campaña int invalida", "Email");

		mockMvc.perform(post("/api/events")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
									"userId": "int-user-2",
									"stage": "etapa_invalida",
									"channelName": "Email",
									"campaignId": "%s",
									"eventDate": "2026-01-10"
								}
								""".formatted(campaign.getId())))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.error").value("Bad Request"))
				.andExpect(jsonPath("$.message").exists())
				.andExpect(jsonPath("$.path").value("/api/events"))
				.andExpect(jsonPath("$.timestamp").exists());
	}

	@Test
	void returns404ForNonexistentUser() throws Exception {
		mockMvc.perform(get("/api/users/inexistente"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.error").value("Not Found"))
				.andExpect(jsonPath("$.message").exists())
				.andExpect(jsonPath("$.path").value("/api/users/inexistente"))
				.andExpect(jsonPath("$.timestamp").exists());
	}

	@Test
	void funnelReturns200WithSixStages() throws Exception {
		mockMvc.perform(get("/api/analytics/funnel"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.stages.length()").value(6))
				.andExpect(jsonPath("$.stages[0].stage").value("VISITA"))
				.andExpect(jsonPath("$.stages[5].stage").value("RETENCION"));
	}

	@Test
	void segmentsReturns200() throws Exception {
		mockMvc.perform(get("/api/analytics/segments"))
				.andExpect(status().isOk());
	}
}