package com.growthhub.api.experiment;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ExperimentStatus {
	BORRADOR("borrador"),
	ACTIVO("activo"),
	TERMINADO("terminado"),
	CANCELADO("cancelado");

	private final String value;

	ExperimentStatus(String value) {
		this.value = value;
	}

	@JsonValue
	public String getValue() {
		return value;
	}
}