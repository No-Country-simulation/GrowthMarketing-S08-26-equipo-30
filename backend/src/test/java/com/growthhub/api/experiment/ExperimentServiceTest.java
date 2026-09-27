package com.growthhub.api.experiment;

import com.growthhub.api.campaign.Campaign;
import com.growthhub.api.campaign.CampaignRepository;
import com.growthhub.api.campaign.CampaignTestFixtures;
import com.growthhub.api.campaign.ChannelRepository;
import com.growthhub.api.exception.BadRequestException;
import com.growthhub.api.exception.NotFoundException;
import com.growthhub.api.experiment.dto.CloseExperimentRequest;
import com.growthhub.api.experiment.dto.ExperimentRequest;
import com.growthhub.api.experiment.dto.ExperimentResponse;
import com.growthhub.api.experiment.dto.ExperimentVariantMetricsRequest;
import com.growthhub.api.experiment.dto.ExperimentVariantRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class ExperimentServiceTest {

	@Autowired
	private ExperimentService experimentService;

	@Autowired
	private ExperimentRepository experimentRepository;

	@Autowired
	private CampaignRepository campaignRepository;

	@Autowired
	private ChannelRepository channelRepository;

	private Campaign seedCampaign() {
		return CampaignTestFixtures.createCampaign(
				campaignRepository, channelRepository, "Campaña experimento", "Email");
	}

	private ExperimentRequest validRequest(String campaignId) {
		return new ExperimentRequest(
				campaignId,
				"Test A/B",
				"Hipótesis de prueba",
				"conversion_rate",
				null,
				List.of(
						new ExperimentVariantRequest("A", "Variante A"),
						new ExperimentVariantRequest("B", "Variante B")));
	}

	private List<ExperimentVariantMetricsRequest> validMetrics() {
		return List.of(
				new ExperimentVariantMetricsRequest(
						"A", 100L, 50L, 30L, 10L, 200L, new BigDecimal("50.00"), Instant.now()),
				new ExperimentVariantMetricsRequest(
						"B", 80L, 40L, 20L, 8L, 160L, new BigDecimal("40.00"), Instant.now()));
	}

	private ExperimentResponse createValid(Campaign campaign) {
		return experimentService.createExperiment(validRequest(campaign.getId()));
	}

	@Test
	void createsValidExperimentWithTwoVariants() {
		Campaign campaign = seedCampaign();

		ExperimentResponse response = createValid(campaign);

		assertThat(response.id()).isNotNull();
		assertThat(response.campaignId()).isEqualTo(campaign.getId());
		assertThat(response.campaignName()).isEqualTo("Campaña experimento");
		assertThat(response.status()).isEqualTo(ExperimentStatus.BORRADOR);
		assertThat(response.viewStatus()).isEqualTo(ExperimentViewStatus.PLANIFICADO);
		assertThat(response.targetMetric()).isEqualTo(TargetMetric.CONVERSION_RATE);
		assertThat(response.resultType()).isNull();
		assertThat(response.variants()).hasSize(2);
		assertThat(response.variants()).extracting(v -> v.code()).containsExactly("A", "B");
		assertThat(experimentRepository.findById(response.id())).isPresent();
	}

	@Test
	void rejectsMissingCampaign() {
		assertThatThrownBy(() -> experimentService.createExperiment(validRequest("campana-inexistente")))
				.isInstanceOf(NotFoundException.class)
				.hasMessage("Campaña no encontrada");
	}

	@Test
	void rejectsMissingOrDuplicateVariants() {
		Campaign campaign = seedCampaign();

		assertThatThrownBy(() -> experimentService.createExperiment(new ExperimentRequest(
				campaign.getId(), "Sin variantes", "Hipótesis", "conversion_rate", null, List.of())))
				.isInstanceOf(BadRequestException.class);
		assertThatThrownBy(() -> experimentService.createExperiment(new ExperimentRequest(
				campaign.getId(), "Una variante", "Hipótesis", "conversion_rate", null,
				List.of(new ExperimentVariantRequest("A", "Sola")))))
				.isInstanceOf(BadRequestException.class);
		assertThatThrownBy(() -> experimentService.createExperiment(new ExperimentRequest(
				campaign.getId(), "Variantes repetidas", "Hipótesis", "conversion_rate", null,
				List.of(new ExperimentVariantRequest("A", "Primera"),
						new ExperimentVariantRequest("A", "Segunda")))))
				.isInstanceOf(BadRequestException.class);
		assertThatThrownBy(() -> experimentService.createExperiment(new ExperimentRequest(
				campaign.getId(), "Código inválido", "Hipótesis", "conversion_rate", null,
				List.of(new ExperimentVariantRequest("C", "Mala"),
						new ExperimentVariantRequest("B", "Bien")))))
				.isInstanceOf(BadRequestException.class);
	}

	@Test
	void rejectsInvalidCostPerResultConfiguration() {
		Campaign campaign = seedCampaign();
		List<ExperimentVariantRequest> variants = List.of(
				new ExperimentVariantRequest("A", "Variante A"),
				new ExperimentVariantRequest("B", "Variante B"));

		assertThatThrownBy(() -> experimentService.createExperiment(new ExperimentRequest(
				campaign.getId(), "Costo sin tipo", "Hipótesis", "cost_per_result", null, variants)))
				.isInstanceOf(BadRequestException.class);
		assertThatThrownBy(() -> experimentService.createExperiment(new ExperimentRequest(
				campaign.getId(), "Tipo sin costo", "Hipótesis", "conversion_rate", "click", variants)))
				.isInstanceOf(BadRequestException.class);
	}

	@Test
	void startsDraftExperiment() {
		Campaign campaign = seedCampaign();
		ExperimentResponse created = createValid(campaign);

		ExperimentResponse started = experimentService.startExperiment(created.id());

		assertThat(started.status()).isEqualTo(ExperimentStatus.ACTIVO);
		assertThat(started.viewStatus()).isEqualTo(ExperimentViewStatus.EN_CURSO);
		assertThat(started.startedAt()).isNotNull();
		assertThatThrownBy(() -> experimentService.startExperiment(created.id()))
				.isInstanceOf(BadRequestException.class);
	}

	@Test
	void closesValidatedExperimentWithWinner() {
		Campaign campaign = seedCampaign();
		ExperimentResponse created = createValid(campaign);

		ExperimentResponse closed = experimentService.closeExperiment(created.id(),
				new CloseExperimentRequest("validado", "A", "La variante A ganó", validMetrics()));

		assertThat(closed.status()).isEqualTo(ExperimentStatus.TERMINADO);
		assertThat(closed.viewStatus()).isEqualTo(ExperimentViewStatus.VALIDADO);
		assertThat(closed.winnerCode()).isEqualTo("A");
		assertThat(closed.conclusion()).isEqualTo("La variante A ganó");
		assertThat(closed.endedAt()).isNotNull();
		assertThat(closed.variants()).extracting(v -> v.code()).containsExactly("A", "B");
		assertThat(closed.variants()).allMatch(v -> v.visits() != null && v.conversions() != null);
	}

	@Test
	void closesNotValidatedExperimentWithoutWinner() {
		Campaign campaign = seedCampaign();
		ExperimentResponse created = createValid(campaign);

		ExperimentResponse closed = experimentService.closeExperiment(created.id(),
				new CloseExperimentRequest("noValidado", "A", "Sin diferencias significativas", validMetrics()));

		assertThat(closed.status()).isEqualTo(ExperimentStatus.TERMINADO);
		assertThat(closed.viewStatus()).isEqualTo(ExperimentViewStatus.NO_VALIDADO);
		assertThat(closed.winnerCode()).isNull();
		assertThat(closed.endedAt()).isNotNull();
	}

	@Test
	void closesDraftExperiment() {
		Campaign campaign = seedCampaign();
		ExperimentResponse created = createValid(campaign);

		ExperimentResponse closed = experimentService.closeExperiment(created.id(),
				new CloseExperimentRequest("validado", "B", "Cierre desde borrador", validMetrics()));

		assertThat(closed.status()).isEqualTo(ExperimentStatus.TERMINADO);
		assertThat(closed.winnerCode()).isEqualTo("B");
	}

	@Test
	void rejectsCloseWithoutConclusion() {
		Campaign campaign = seedCampaign();
		ExperimentResponse created = createValid(campaign);

		assertThatThrownBy(() -> experimentService.closeExperiment(created.id(),
				new CloseExperimentRequest("validado", "A", "   ", validMetrics())))
				.isInstanceOf(BadRequestException.class);
	}

	@Test
	void rejectsValidatedCloseWithoutWinner() {
		Campaign campaign = seedCampaign();
		ExperimentResponse created = createValid(campaign);

		assertThatThrownBy(() -> experimentService.closeExperiment(created.id(),
				new CloseExperimentRequest("validado", null, "Sin ganador", validMetrics())))
				.isInstanceOf(BadRequestException.class);
		assertThatThrownBy(() -> experimentService.closeExperiment(created.id(),
				new CloseExperimentRequest("validado", "C", "Ganador inválido", validMetrics())))
				.isInstanceOf(BadRequestException.class);
	}

	@Test
	void rejectsNegativeMetrics() {
		Campaign campaign = seedCampaign();
		ExperimentResponse created = createValid(campaign);

		List<ExperimentVariantMetricsRequest> metrics = List.of(
				new ExperimentVariantMetricsRequest(
						"A", -1L, 0L, 0L, 0L, 0L, new BigDecimal("0.00"), Instant.now()),
				new ExperimentVariantMetricsRequest(
						"B", 80L, 40L, 20L, 8L, 160L, new BigDecimal("40.00"), Instant.now()));

		assertThatThrownBy(() -> experimentService.closeExperiment(created.id(),
				new CloseExperimentRequest("validado", "A", "Métricas negativas", metrics)))
				.isInstanceOf(BadRequestException.class);
	}

	@Test
	void rejectsMetricCountsOutOfOrder() {
		Campaign campaign = seedCampaign();
		ExperimentResponse created = createValid(campaign);

		List<ExperimentVariantMetricsRequest> metrics = List.of(
				new ExperimentVariantMetricsRequest(
						"A", 100L, 120L, 30L, 10L, 200L, new BigDecimal("50.00"), Instant.now()),
				new ExperimentVariantMetricsRequest(
						"B", 80L, 40L, 20L, 8L, 160L, new BigDecimal("40.00"), Instant.now()));

		assertThatThrownBy(() -> experimentService.closeExperiment(created.id(),
				new CloseExperimentRequest("validado", "A", "Conteos fuera de orden", metrics)))
				.isInstanceOf(BadRequestException.class);
	}

	@Test
	void cancelsDraftExperiment() {
		Campaign campaign = seedCampaign();
		ExperimentResponse created = createValid(campaign);

		ExperimentResponse cancelled = experimentService.cancelExperiment(created.id());

		assertThat(cancelled.status()).isEqualTo(ExperimentStatus.CANCELADO);
		assertThat(cancelled.viewStatus()).isEqualTo(ExperimentViewStatus.NO_VALIDADO);
		assertThat(cancelled.endedAt()).isNotNull();
	}

	@Test
	void rejectsCancellingTerminatedExperiment() {
		Campaign campaign = seedCampaign();
		ExperimentResponse created = createValid(campaign);
		experimentService.closeExperiment(created.id(),
				new CloseExperimentRequest("validado", "A", "Terminado", validMetrics()));

		assertThatThrownBy(() -> experimentService.cancelExperiment(created.id()))
				.isInstanceOf(BadRequestException.class);
	}

	@Test
	void updatesDraftExperiment() {
		Campaign campaign = seedCampaign();
		ExperimentResponse created = createValid(campaign);

		ExperimentResponse updated = experimentService.updateExperiment(created.id(),
				new ExperimentRequest(
						campaign.getId(),
						"Nombre nuevo",
						"Hipótesis nueva",
						"activation_rate",
						null,
						List.of(
								new ExperimentVariantRequest("A", "Variante A nueva"),
								new ExperimentVariantRequest("B", "Variante B nueva"))));

		assertThat(updated.name()).isEqualTo("Nombre nuevo");
		assertThat(updated.hypothesis()).isEqualTo("Hipótesis nueva");
		assertThat(updated.targetMetric()).isEqualTo(TargetMetric.ACTIVATION_RATE);
		assertThat(updated.variants()).extracting(v -> v.description())
				.containsExactly("Variante A nueva", "Variante B nueva");
	}

	@Test
	void listsAndGetsExperiment() {
		Campaign campaign = seedCampaign();
		ExperimentResponse first = createValid(campaign);
		ExperimentResponse second = createValid(campaign);

		List<ExperimentResponse> experiments = experimentService.listExperiments();

		assertThat(experiments).hasSize(2);
		assertThat(experiments).extracting(e -> e.id()).contains(first.id(), second.id());

		ExperimentResponse byId = experimentService.getExperiment(first.id());

		assertThat(byId.id()).isEqualTo(first.id());
		assertThat(byId.campaignName()).isEqualTo("Campaña experimento");
		assertThat(byId.variants()).hasSize(2);
		assertThatThrownBy(() -> experimentService.getExperiment("no-existe"))
				.isInstanceOf(NotFoundException.class)
				.hasMessage("Experimento no encontrado");
	}
}