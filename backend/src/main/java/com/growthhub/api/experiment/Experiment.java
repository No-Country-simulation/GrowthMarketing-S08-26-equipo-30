package com.growthhub.api.experiment;

import com.growthhub.api.campaign.Campaign;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "experiments")
@Getter
@Setter
public class Experiment {

	@Id
	@Column(length = 32)
	private String id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "campaign_id", nullable = false)
	private Campaign campaign;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String hypothesis;

	@Column(name = "target_metric", nullable = false, length = 40)
	private TargetMetric targetMetric;

	@Column(name = "result_type", length = 20)
	private ResultType resultType;

	@Column(nullable = false, length = 20)
	private ExperimentStatus status = ExperimentStatus.BORRADOR;

	@Column(name = "started_at")
	private Instant startedAt;

	@Column(name = "ended_at")
	private Instant endedAt;

	@Column(name = "winner_code", length = 1)
	private String winnerCode;

	@Column
	private String conclusion;

	@OneToMany(mappedBy = "experiment", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ExperimentVariant> variants = new ArrayList<>();

	public void addVariant(String code, String description) {
		ExperimentVariant variant = new ExperimentVariant();
		variant.setExperiment(this);
		variant.getId().setCode(code);
		variant.setDescription(description);
		this.variants.add(variant);
	}
}