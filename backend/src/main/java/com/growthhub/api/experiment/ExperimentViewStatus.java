package com.growthhub.api.experiment;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ExperimentViewStatus {
	PLANIFICADO("planificado"),
	EN_CURSO("enCurso"),
	VALIDADO("validado"),
	NO_VALIDADO("noValidado");

	private final String value;

	ExperimentViewStatus(String value) {
		this.value = value;
	}

	@JsonValue
	public String getValue() {
		return value;
	}
}