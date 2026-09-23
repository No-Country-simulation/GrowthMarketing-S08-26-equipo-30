package com.growthhub.api.campaign;

import com.growthhub.api.shared.MetricSource;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "campaign_metrics")
@Getter
@Setter
public class CampaignMetric {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "campaign_id", nullable = false)
	private Campaign campaign;

	@Column(name = "captured_at", nullable = false)
	private Instant capturedAt;

	@Column(name = "period_start", nullable = false)
	private LocalDate periodStart;

	@Column(name = "period_end", nullable = false)
	private LocalDate periodEnd;

	@Column(nullable = false, length = 20)
	private MetricSource source;

	@Column(nullable = false)
	private long reach;

	@Column(nullable = false)
	private long impressions;

	@Column(nullable = false)
	private long clicks;

	@Column(nullable = false)
	private long conversions;

	@Column(name = "cost_per_result", nullable = false, precision = 18, scale = 2)
	private BigDecimal costPerResult = BigDecimal.ZERO;
}