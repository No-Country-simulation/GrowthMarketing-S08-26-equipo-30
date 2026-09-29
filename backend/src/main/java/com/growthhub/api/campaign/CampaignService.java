package com.growthhub.api.campaign;

import com.growthhub.api.campaign.dto.CampaignRequest;
import com.growthhub.api.campaign.dto.CampaignResponse;
import com.growthhub.api.campaign.dto.ChannelResponse;
import com.growthhub.api.exception.BadRequestException;
import com.growthhub.api.exception.ConflictException;
import com.growthhub.api.exception.NotFoundException;
import com.growthhub.api.experiment.ExperimentRepository;
import com.growthhub.api.experiment.ExperimentStatus;
import com.growthhub.api.shared.CampaignStatus;
import com.growthhub.api.shared.FunnelStage;
import com.growthhub.api.shared.NameNormalizer;
import com.growthhub.api.shared.UuidHexGenerator;
import com.growthhub.api.tracking.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CampaignService {

	private final CampaignRepository campaignRepository;
	private final ChannelRepository channelRepository;
	private final EventRepository eventRepository;
	private final ExperimentRepository experimentRepository;

	public CampaignService(CampaignRepository campaignRepository, ChannelRepository channelRepository,
			EventRepository eventRepository, ExperimentRepository experimentRepository) {
		this.campaignRepository = campaignRepository;
		this.channelRepository = channelRepository;
		this.eventRepository = eventRepository;
		this.experimentRepository = experimentRepository;
	}

	@Transactional(readOnly = true)
	public List<ChannelResponse> listChannels() {
		return channelRepository.findAllByOrderByNameAsc().stream().map(this::toChannelResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<CampaignResponse> listCampaigns(LocalDate from, LocalDate to, Long channelId) {
		return campaignRepository.findVisible(from, to, channelId).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public CampaignResponse getCampaign(String id) {
		return toResponse(requireCampaign(id));
	}

	@Transactional
	public CampaignResponse createCampaign(CampaignRequest request) {
		validate(request, null);
		Campaign campaign = new Campaign();
		campaign.setId(UuidHexGenerator.newId());
		apply(campaign, request);
		campaign.setStatus(CampaignStatus.ACTIVA);
		return toResponse(campaignRepository.save(campaign));
	}

	@Transactional
	public CampaignResponse updateCampaign(String id, CampaignRequest request) {
		Campaign campaign = requireCampaign(id);
		validate(request, id);
		apply(campaign, request);
		return toResponse(campaign);
	}

	@Transactional
	public CampaignResponse updateStatus(String id, CampaignStatus status) {
		Campaign campaign = requireCampaign(id);
		campaign.setStatus(status);
		return toResponse(campaign);
	}

	@Transactional
	public CampaignResponse archive(String id) {
		Campaign campaign = requireCampaign(id);
		if (experimentRepository.existsByCampaignIdAndStatus(campaign.getId(), ExperimentStatus.ACTIVO)) {
			throw new ConflictException("No se puede archivar una campaña con experimento activo");
		}
		campaign.setArchivedAt(Instant.now());
		return toResponse(campaign);
	}

	private void validate(CampaignRequest request, String currentId) {
		if (request.endDate().isBefore(request.startDate())) {
			throw new BadRequestException("La fecha final no puede ser anterior a la inicial");
		}
		String nameKey = NameNormalizer.normalize(request.name());
		campaignRepository.findByNameKey(nameKey).ifPresent(existing -> {
			if (!existing.getId().equals(currentId)) {
				throw new ConflictException("Ya existe una campaña con ese nombre");
			}
		});
		Set<Long> ids = new LinkedHashSet<>(request.channelIds());
		if (ids.size() != request.channelIds().size()) {
			throw new BadRequestException("Los canales no pueden repetirse");
		}
		if (ids.isEmpty()) {
			throw new BadRequestException("Debe seleccionar al menos un canal");
		}
		List<Channel> channels = channelRepository.findAllById(ids);
		if (channels.size() != ids.size()) {
			throw new NotFoundException("Uno o más canales no existen");
		}
	}

	private void apply(Campaign campaign, CampaignRequest request) {
		campaign.setName(request.name().trim());
		campaign.setNameKey(NameNormalizer.normalize(request.name()));
		campaign.setObjective(request.objective().trim());
		campaign.setBudget(request.budget());
		campaign.setStartDate(request.startDate());
		campaign.setEndDate(request.endDate());
		Map<Long, Channel> channels = channelRepository.findAllById(request.channelIds()).stream()
				.collect(Collectors.toMap(Channel::getId, channel -> channel));
		campaign.getChannels().clear();
		for (Long id : new LinkedHashSet<>(request.channelIds())) {
			campaign.getChannels().add(channels.get(id));
		}
	}

	private Campaign requireCampaign(String id) {
		return campaignRepository.findById(id).orElseThrow(() -> new NotFoundException("Campaña no encontrada"));
	}

	private CampaignResponse toResponse(Campaign campaign) {
		Map<FunnelStage, Long> counts = eventRepository.countStagesByCampaign(campaign.getId()).stream()
				.collect(Collectors.toMap(row -> (FunnelStage) row[0], row -> (Long) row[1]));
		return new CampaignResponse(
				campaign.getId(), campaign.getName(), campaign.getObjective(), campaign.getBudget(),
				campaign.getStartDate(), campaign.getEndDate(), campaign.getStatus(), campaign.getArchivedAt(),
				campaign.getChannels().stream().map(this::toChannelResponse).toList(),
				counts.getOrDefault(FunnelStage.VISITA, 0L),
				counts.getOrDefault(FunnelStage.REGISTRO, 0L),
				counts.getOrDefault(FunnelStage.CONVERSION, 0L),
				counts.getOrDefault(FunnelStage.RETENCION, 0L));
	}

	private ChannelResponse toChannelResponse(Channel channel) {
		return new ChannelResponse(channel.getId(), channel.getName());
	}
}
