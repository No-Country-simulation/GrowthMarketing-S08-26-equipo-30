package com.growthhub.api.experiment.dto;

import com.growthhub.api.experiment.ExperimentStatus;
import com.growthhub.api.experiment.ExperimentViewStatus;
import com.growthhub.api.experiment.ResultType;
import com.growthhub.api.experiment.TargetMetric;

import java.time.Instant;
import java.util.List;

public record ExperimentResponse(
		String id,
		String campaignId,
		String campaignName,
		ExperimentStatus status,
		ExperimentViewStatus viewStatus,
		String name,
		String hypothesis,
		TargetMetric targetMetric,
		ResultType resultType,
		Instant startedAt,
		Instant endedAt,
		String winnerCode,
		String conclusion,
		List<ExperimentVariantResponse> variants) {
}