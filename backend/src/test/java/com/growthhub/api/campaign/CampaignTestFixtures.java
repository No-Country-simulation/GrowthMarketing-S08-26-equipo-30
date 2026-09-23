package com.growthhub.api.campaign;

import com.growthhub.api.shared.CampaignStatus;
import com.growthhub.api.shared.NameNormalizer;
import com.growthhub.api.shared.UuidHexGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public final class CampaignTestFixtures {

	private CampaignTestFixtures() {
	}

	public static Campaign createCampaign(CampaignRepository campaignRepository,
			ChannelRepository channelRepository,
			String name,
			String... channelNames) {
		Campaign campaign = new Campaign();
		campaign.setId(UuidHexGenerator.newId());
		campaign.setName(name);
		campaign.setNameKey(NameNormalizer.normalize(name));
		campaign.setObjective("objetivo de prueba");
		campaign.setBudget(new BigDecimal("1000.00"));
		campaign.setStartDate(LocalDate.of(2026, 1, 1));
		campaign.setEndDate(LocalDate.of(2026, 4, 1));
		campaign.setStatus(CampaignStatus.ACTIVA);

		List<Channel> channels = new ArrayList<>();
		for (String channelName : channelNames) {
			Channel channel = channelRepository.findByNameIgnoreCase(channelName).orElseGet(() -> {
				Channel created = new Channel();
				created.setName(channelName);
				return channelRepository.save(created);
			});
			channels.add(channel);
		}
		campaign.setChannels(channels);
		return campaignRepository.save(campaign);
	}
}