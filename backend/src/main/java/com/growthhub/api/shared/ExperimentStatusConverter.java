package com.growthhub.api.shared;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ExperimentStatusConverter implements AttributeConverter<ExperimentStatus, String> {

	@Override
	public String convertToDatabaseColumn(ExperimentStatus attribute) {
		return attribute == null ? null : attribute.name().toLowerCase();
	}

	@Override
	public ExperimentStatus convertToEntityAttribute(String dbData) {
		return dbData == null ? null : ExperimentStatus.valueOf(dbData.toUpperCase());
	}
}