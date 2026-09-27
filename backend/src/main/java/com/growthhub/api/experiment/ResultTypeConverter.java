package com.growthhub.api.experiment;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ResultTypeConverter implements AttributeConverter<ResultType, String> {

	@Override
	public String convertToDatabaseColumn(ResultType attribute) {
		return attribute == null ? null : attribute.name().toLowerCase();
	}

	@Override
	public ResultType convertToEntityAttribute(String dbData) {
		return dbData == null ? null : ResultType.valueOf(dbData.toUpperCase());
	}
}