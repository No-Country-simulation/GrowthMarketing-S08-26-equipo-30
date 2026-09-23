package com.growthhub.api.shared;

import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Comparator;

@Component
public class FunnelStageResolver {

	public FunnelStage currentStage(Collection<FunnelStage> stages) {
		if (stages == null || stages.isEmpty()) {
			return null;
		}
		return stages.stream()
				.max(Comparator.comparingInt(FunnelStage::ordinal))
				.orElse(null);
	}
}