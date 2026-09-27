package com.growthhub.api.experiment;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class ExperimentVariantId implements Serializable {

	@Column(name = "experiment_id", length = 32)
	private String experimentId;

	@Column(length = 1)
	private String code;

	public ExperimentVariantId() {
	}

	public ExperimentVariantId(String experimentId, String code) {
		this.experimentId = experimentId;
		this.code = code;
	}

	public String getExperimentId() {
		return experimentId;
	}

	public void setExperimentId(String experimentId) {
		this.experimentId = experimentId;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Override
	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof ExperimentVariantId that)) {
			return false;
		}
		return java.util.Objects.equals(experimentId, that.experimentId)
				&& java.util.Objects.equals(code, that.code);
	}

	@Override
	public int hashCode() {
		return java.util.Objects.hash(experimentId, code);
	}
}