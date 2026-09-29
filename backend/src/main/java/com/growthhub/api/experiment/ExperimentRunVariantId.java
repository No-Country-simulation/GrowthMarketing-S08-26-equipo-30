package com.growthhub.api.experiment;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class ExperimentRunVariantId implements Serializable {
	@Column(name = "run_id")
	private Long runId;

	@Column(length = 1)
	private String code;
}
