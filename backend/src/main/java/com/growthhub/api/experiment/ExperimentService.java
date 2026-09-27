package com.growthhub.api.experiment;

import com.growthhub.api.campaign.Campaign;
import com.growthhub.api.campaign.CampaignRepository;
import com.growthhub.api.exception.BadRequestException;
import com.growthhub.api.exception.NotFoundException;
import com.growthhub.api.experiment.dto.CloseExperimentRequest;
import com.growthhub.api.experiment.dto.ExperimentRequest;
import com.growthhub.api.experiment.dto.ExperimentResponse;
import com.growthhub.api.experiment.dto.ExperimentVariantMetricsRequest;
import com.growthhub.api.experiment.dto.ExperimentVariantRequest;
import com.growthhub.api.experiment.dto.ExperimentVariantResponse;
import com.growthhub.api.shared.UuidHexGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class ExperimentService {

	private static final Set<String> VARIANT_CODES = Set.of("A", "B");

	private final ExperimentRepository experimentRepository;
	private final CampaignRepository campaignRepository;

	public ExperimentService(ExperimentRepository experimentRepository, CampaignRepository campaignRepository) {
		this.experimentRepository = experimentRepository;
		this.campaignRepository = campaignRepository;
	}

	@Transactional(readOnly = true)
	public List<ExperimentResponse> listExperiments() {
		return experimentRepository.findAllByOrderByStartedAtDescIdAsc().stream()
				.map(this::toResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public ExperimentResponse getExperiment(String id) {
		return toResponse(requireExperiment(id));
	}

	@Transactional
	public ExperimentResponse createExperiment(ExperimentRequest request) {
		validateCreateRequest(request);
		Campaign campaign = requireCampaign(request.campaignId());

		Experiment experiment = new Experiment();
		experiment.setId(UuidHexGenerator.newId());
		experiment.setCampaign(campaign);
		applyRequestFields(experiment, request);
		experiment.setStatus(ExperimentStatus.BORRADOR);
		return toResponse(experimentRepository.save(experiment));
	}

	@Transactional
	public ExperimentResponse updateExperiment(String id, ExperimentRequest request) {
		Experiment experiment = requireExperiment(id);
		if (experiment.getStatus() == ExperimentStatus.TERMINADO
				|| experiment.getStatus() == ExperimentStatus.CANCELADO) {
			throw new BadRequestException("No se puede editar un experimento terminado o cancelado");
		}
		validateCreateRequest(request);
		Campaign campaign = requireCampaign(request.campaignId());
		experiment.setCampaign(campaign);
		applyRequestFields(experiment, request);
		return toResponse(experiment);
	}

	@Transactional
	public ExperimentResponse startExperiment(String id) {
		Experiment experiment = requireExperiment(id);
		if (experiment.getStatus() != ExperimentStatus.BORRADOR) {
			throw new BadRequestException("Solo se puede iniciar un experimento en borrador");
		}
		experiment.setStatus(ExperimentStatus.ACTIVO);
		experiment.setStartedAt(Instant.now());
		return toResponse(experiment);
	}

	@Transactional
	public ExperimentResponse closeExperiment(String id, CloseExperimentRequest request) {
		Experiment experiment = requireExperiment(id);
		if (experiment.getStatus() != ExperimentStatus.ACTIVO
				&& experiment.getStatus() != ExperimentStatus.BORRADOR) {
			throw new BadRequestException("Solo se puede cerrar un experimento activo o en borrador");
		}
		if (request.conclusion() == null || request.conclusion().isBlank()) {
			throw new BadRequestException("La conclusión es obligatoria");
		}

		validateMetrics(request.variants());

		String winnerCode = null;
		String result = normalizeResult(request.result());
		if (result.equals("validado")) {
			String candidate = request.winnerCode() == null ? null : request.winnerCode().trim().toUpperCase();
			if (candidate == null || !VARIANT_CODES.contains(candidate)) {
				throw new BadRequestException("Un resultado validado requiere un ganador 'A' o 'B'");
			}
			winnerCode = candidate;
		}

		experiment.setStatus(ExperimentStatus.TERMINADO);
		experiment.setEndedAt(Instant.now());
		experiment.setConclusion(request.conclusion().trim());
		experiment.setWinnerCode(winnerCode);
		applyMetrics(experiment, request.variants());
		return toResponse(experiment);
	}

	@Transactional
	public ExperimentResponse cancelExperiment(String id) {
		Experiment experiment = requireExperiment(id);
		if (experiment.getStatus() == ExperimentStatus.TERMINADO) {
			throw new BadRequestException("No se puede cancelar un experimento terminado");
		}
		experiment.setStatus(ExperimentStatus.CANCELADO);
		experiment.setEndedAt(Instant.now());
		return toResponse(experiment);
	}

	private Experiment requireExperiment(String id) {
		return experimentRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Experimento no encontrado"));
	}

	private Campaign requireCampaign(String campaignId) {
		return campaignRepository.findById(campaignId)
				.orElseThrow(() -> new NotFoundException("Campaña no encontrada"));
	}

	private void validateCreateRequest(ExperimentRequest request) {
		if (request.campaignId() == null || request.campaignId().isBlank()) {
			throw new BadRequestException("La campaña es obligatoria");
		}
		if (request.name() == null || request.name().isBlank()) {
			throw new BadRequestException("El nombre del experimento es obligatorio");
		}
		if (request.hypothesis() == null || request.hypothesis().isBlank()) {
			throw new BadRequestException("La hipótesis es obligatoria");
		}
		if (request.variants() == null || request.variants().size() != 2) {
			throw new BadRequestException("Un experimento A/B debe tener exactamente 2 variantes");
		}

		Set<String> codes = new HashSet<>();
		for (ExperimentVariantRequest variant : request.variants()) {
			if (variant.code() == null || variant.code().isBlank()) {
				throw new BadRequestException("El código de la variante es obligatorio");
			}
			if (variant.description() == null || variant.description().isBlank()) {
				throw new BadRequestException("La descripción de la variante es obligatoria");
			}
			String code = variant.code().trim().toUpperCase();
			if (!VARIANT_CODES.contains(code)) {
				throw new BadRequestException("El código de la variante debe ser 'A' o 'B'");
			}
			if (!codes.add(code)) {
				throw new BadRequestException("Las variantes no pueden repetir código");
			}
		}
		if (!codes.containsAll(VARIANT_CODES)) {
			throw new BadRequestException("El experimento debe tener las variantes 'A' y 'B'");
		}

		TargetMetric targetMetric = parseTargetMetric(request.targetMetric());
		ResultType resultType = parseResultType(request.resultType());
		if (targetMetric == TargetMetric.COST_PER_RESULT) {
			if (resultType == null) {
				throw new BadRequestException("La métrica cost_per_result requiere un resultType (click, registration o conversion)");
			}
		} else if (resultType != null) {
			throw new BadRequestException("resultType solo se permite para la métrica cost_per_result");
		}
	}

	private void applyRequestFields(Experiment experiment, ExperimentRequest request) {
		experiment.setName(request.name().trim());
		experiment.setHypothesis(request.hypothesis().trim());
		experiment.setTargetMetric(parseTargetMetric(request.targetMetric()));
		experiment.setResultType(parseResultType(request.resultType()));

		Map<String, ExperimentVariantRequest> byCode = new HashMap<>();
		for (ExperimentVariantRequest variant : request.variants()) {
			byCode.put(variant.code().trim().toUpperCase(), variant);
		}
		Map<String, ExperimentVariant> existing = new HashMap<>();
		for (ExperimentVariant variant : experiment.getVariants()) {
			existing.put(variant.getId().getCode(), variant);
		}
		for (String code : VARIANT_CODES) {
			ExperimentVariant variant = existing.get(code);
			ExperimentVariantRequest requestVariant = byCode.get(code);
			if (variant != null) {
				variant.setDescription(requestVariant.description().trim());
			} else {
				experiment.addVariant(code, requestVariant.description().trim());
			}
		}
	}

	private void validateMetrics(List<ExperimentVariantMetricsRequest> metrics) {
		if (metrics == null || metrics.isEmpty()) {
			throw new BadRequestException("Debe enviar las métricas de las variantes");
		}
		Set<String> codes = new HashSet<>();
		for (ExperimentVariantMetricsRequest metric : metrics) {
			if (metric.code() == null || metric.code().isBlank()) {
				throw new BadRequestException("El código de la variante es obligatorio");
			}
			String code = metric.code().trim().toUpperCase();
			if (!VARIANT_CODES.contains(code)) {
				throw new BadRequestException("El código de la variante debe ser 'A' o 'B'");
			}
			if (!codes.add(code)) {
				throw new BadRequestException("Las métricas no pueden repetir código");
			}
			if (metric.visits() != null && metric.visits() < 0) {
				throw new BadRequestException("Las métricas no pueden ser negativas");
			}
			if (metric.registrations() != null && metric.registrations() < 0) {
				throw new BadRequestException("Las métricas no pueden ser negativas");
			}
			if (metric.activations() != null && metric.activations() < 0) {
				throw new BadRequestException("Las métricas no pueden ser negativas");
			}
			if (metric.conversions() != null && metric.conversions() < 0) {
				throw new BadRequestException("Las métricas no pueden ser negativas");
			}
			if (metric.clicks() != null && metric.clicks() < 0) {
				throw new BadRequestException("Las métricas no pueden ser negativas");
			}
			if (metric.spend() != null && metric.spend().signum() < 0) {
				throw new BadRequestException("Las métricas no pueden ser negativas");
			}
			if (metric.registrations() != null && metric.visits() != null && metric.registrations() > metric.visits()) {
				throw new BadRequestException("Los registros no pueden superar las visitas");
			}
			if (metric.activations() != null && metric.registrations() != null
					&& metric.activations() > metric.registrations()) {
				throw new BadRequestException("Las activaciones no pueden superar los registros");
			}
			if (metric.conversions() != null && metric.activations() != null
					&& metric.conversions() > metric.activations()) {
				throw new BadRequestException("Las conversiones no pueden superar las activaciones");
			}
		}
		if (!codes.containsAll(VARIANT_CODES)) {
			throw new BadRequestException("Debe enviar métricas para las variantes 'A' y 'B'");
		}
	}

	private void applyMetrics(Experiment experiment, List<ExperimentVariantMetricsRequest> metrics) {
		Map<String, ExperimentVariantMetricsRequest> byCode = new HashMap<>();
		for (ExperimentVariantMetricsRequest metric : metrics) {
			byCode.put(metric.code().trim().toUpperCase(), metric);
		}
		for (ExperimentVariant variant : experiment.getVariants()) {
			ExperimentVariantMetricsRequest metric = byCode.get(variant.getId().getCode());
			variant.setVisits(metric.visits());
			variant.setRegistrations(metric.registrations());
			variant.setActivations(metric.activations());
			variant.setConversions(metric.conversions());
			variant.setClicks(metric.clicks());
			variant.setSpend(metric.spend());
			variant.setMeasuredAt(metric.measuredAt());
		}
	}

	private TargetMetric parseTargetMetric(String value) {
		if (value == null || value.isBlank()) {
			throw new BadRequestException("La métrica objetivo es obligatoria");
		}
		try {
			return TargetMetric.valueOf(value.trim().toUpperCase());
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException("Métrica objetivo inválida: " + value);
		}
	}

	private ResultType parseResultType(String value) {
		if (value == null || value.isBlank()) {
			return null;
		}
		try {
			return ResultType.valueOf(value.trim().toUpperCase());
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException("Tipo de resultado inválido: " + value);
		}
	}

	private String normalizeResult(String result) {
		if (result == null || result.isBlank()) {
			throw new BadRequestException("El resultado es obligatorio");
		}
		String normalized = result.trim().toLowerCase().replaceAll("[_\\- ]", "");
		if (normalized.equals("validado") || normalized.equals("novalidado")) {
			return normalized;
		}
		throw new BadRequestException("Resultado inválido: debe ser 'validado' o 'noValidado'");
	}

	private ExperimentViewStatus viewStatus(Experiment experiment) {
		return switch (experiment.getStatus()) {
			case BORRADOR -> ExperimentViewStatus.PLANIFICADO;
			case ACTIVO -> ExperimentViewStatus.EN_CURSO;
			case TERMINADO -> experiment.getWinnerCode() == null
					? ExperimentViewStatus.NO_VALIDADO
					: ExperimentViewStatus.VALIDADO;
			case CANCELADO -> ExperimentViewStatus.NO_VALIDADO;
		};
	}

	private ExperimentResponse toResponse(Experiment experiment) {
		List<ExperimentVariantResponse> variants = new ArrayList<>();
		for (ExperimentVariant variant : experiment.getVariants()) {
			variants.add(new ExperimentVariantResponse(
					variant.getId().getCode(),
					variant.getDescription(),
					variant.getVisits(),
					variant.getRegistrations(),
					variant.getActivations(),
					variant.getConversions(),
					variant.getClicks(),
					variant.getSpend(),
					variant.getMeasuredAt()));
		}
		variants.sort((a, b) -> a.code().compareTo(b.code()));

		return new ExperimentResponse(
				experiment.getId(),
				experiment.getCampaign().getId(),
				experiment.getCampaign().getName(),
				experiment.getStatus(),
				viewStatus(experiment),
				experiment.getName(),
				experiment.getHypothesis(),
				experiment.getTargetMetric(),
				experiment.getResultType(),
				experiment.getStartedAt(),
				experiment.getEndedAt(),
				experiment.getWinnerCode(),
				experiment.getConclusion(),
				variants);
	}
}