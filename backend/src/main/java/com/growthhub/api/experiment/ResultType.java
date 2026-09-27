package com.growthhub.api.experiment;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ResultType {
	CLICK("click"),
	REGISTRATION("registration"),
	CONVERSION("conversion");

	private final String value;

	ResultType(String value) {
		this.value = value;
	}

	@JsonValue
	public String getValue() {
		return value;
	}
}