package com.growthhub.api.experiment;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
@Table(name = "experiment_runs")
@Getter
@Setter
public class ExperimentRun {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "experiment_id", nullable = false)
	private Experiment experiment;

	@Column(name = "run_number", nullable = false)
	private int runNumber;

	@Column(nullable = false, length = 20)
	private ExperimentStatus status;

	@Column(name = "started_at", nullable = false)
	private Instant startedAt;

	@Column(name = "ended_at")
	private Instant endedAt;

	@Column(name = "target_metric", nullable = false, length = 40)
	private TargetMetric targetMetric;

	@Column(name = "winner_code", length = 1)
	private String winnerCode;

	@Column
	private String conclusion;

	@OneToMany(mappedBy = "run", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ExperimentRunVariant> variants = new ArrayList<>();
}
