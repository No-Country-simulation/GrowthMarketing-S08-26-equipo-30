package com.growthhub.api.experiment;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "experiment_variants")
@Getter
@Setter
public class ExperimentVariant {

	@EmbeddedId
	private ExperimentVariantId id = new ExperimentVariantId();

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@MapsId("experimentId")
	@JoinColumn(name = "experiment_id", nullable = false)
	private Experiment experiment;

	@Column(nullable = false)
	private String description;

	private Long visits;
	private Long registrations;
	private Long activations;
	private Long conversions;
	private Long clicks;

	@Column(precision = 18, scale = 2)
	private BigDecimal spend;

	@Column(name = "measured_at")
	private Instant measuredAt;
}