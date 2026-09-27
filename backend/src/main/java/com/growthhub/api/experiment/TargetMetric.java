package com.growthhub.api.experiment;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TargetMetric {
	CONVERSION_RATE("conversion_rate"),
	ACTIVATION_RATE("activation_rate"),
	CUSTOMER_CONVERSION_RATE("customer_conversion_rate"),
	COST_PER_RESULT("cost_per_result");

	private final String value;

	TargetMetric(String value) {
		this.value = value;
	}

	@JsonValue
	public String getValue() {
		return value;
	}
}