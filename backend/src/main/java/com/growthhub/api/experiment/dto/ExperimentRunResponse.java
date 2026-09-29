package com.growthhub.api.experiment.dto;

import com.growthhub.api.experiment.ExperimentStatus;
import com.growthhub.api.experiment.TargetMetric;

import java.time.Instant;
import java.util.List;

public record ExperimentRunResponse(
		Long id,
		int runNumber,
		ExperimentStatus status,
		Instant startedAt,
		Instant endedAt,
		TargetMetric targetMetric,
		String winnerCode,
		String conclusion,
		List<ExperimentVariantResponse> variants) {
}
