package com.growthhub.api.tracking;

import com.growthhub.api.campaign.Campaign;
import com.growthhub.api.campaign.CampaignRepository;
import com.growthhub.api.campaign.Channel;
import com.growthhub.api.campaign.ChannelRepository;
import com.growthhub.api.exception.BadRequestException;
import com.growthhub.api.exception.NotFoundException;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.tracking.dto.EventRequest;
import com.growthhub.api.tracking.dto.EventResponse;
import com.growthhub.api.user.User;
import com.growthhub.api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventService {

	private final EventRepository eventRepository;
	private final UserRepository userRepository;
	private final CampaignRepository campaignRepository;
	private final ChannelRepository channelRepository;

	public EventService(EventRepository eventRepository,
			UserRepository userRepository,
			CampaignRepository campaignRepository,
			ChannelRepository channelRepository) {
		this.eventRepository = eventRepository;
		this.userRepository = userRepository;
		this.campaignRepository = campaignRepository;
		this.channelRepository = channelRepository;
	}

	@Transactional
	public EventResponse registerEvent(EventRequest request) {
		if (request.userId() == null || request.userId().isBlank()) {
			throw new BadRequestException("El usuario es obligatorio");
		}
		FunnelStage stage = parseStage(request.stage());
		if (request.channelName() == null || request.channelName().isBlank()) {
			throw new BadRequestException("El canal es obligatorio");
		}
		if (request.campaignId() == null || request.campaignId().isBlank()) {
			throw new BadRequestException("La campaña es obligatoria");
		}
		if (request.eventDate() == null) {
			throw new BadRequestException("La fecha del evento es obligatoria");
		}

		Campaign campaign = campaignRepository.findById(request.campaignId())
				.orElseThrow(() -> new NotFoundException("Campaña no encontrada"));

		Channel channel = channelRepository.findByNameIgnoreCase(request.channelName().trim())
				.orElseThrow(() -> new NotFoundException("Canal no encontrado"));

		boolean belongsToCampaign = campaign.getChannels().stream()
				.anyMatch(assigned -> assigned.getId().equals(channel.getId()));
		if (!belongsToCampaign) {
			throw new BadRequestException("El canal no pertenece a la campaña");
		}

		String userId = request.userId().trim();
		User user = userRepository.findById(userId).orElseGet(() -> {
			User created = new User();
			created.setId(userId);
			created.setDemo(false);
			return userRepository.save(created);
		});

		Event event = new Event();
		event.setUser(user);
		event.setStage(stage);
		event.setCampaign(campaign);
		event.setChannel(channel);
		event.setEventDate(request.eventDate());
		return toResponse(eventRepository.save(event));
	}

	private FunnelStage parseStage(String value) {
		if (value == null || value.isBlank()) {
			throw new BadRequestException("La etapa es obligatoria");
		}
		try {
			return FunnelStage.valueOf(value.trim().toUpperCase());
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException("Etapa inválida: " + value);
		}
	}

	private EventResponse toResponse(Event event) {
		return new EventResponse(
				event.getId(),
				event.getUser().getId(),
				event.getStage(),
				event.getChannel().getName(),
				event.getCampaign().getId(),
				event.getEventDate());
	}
}