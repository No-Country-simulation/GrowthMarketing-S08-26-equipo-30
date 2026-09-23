package com.growthhub.api.shared;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TargetMetricConverter implements AttributeConverter<TargetMetric, String> {

	@Override
	public String convertToDatabaseColumn(TargetMetric attribute) {
		return attribute == null ? null : attribute.name().toLowerCase();
	}

	@Override
	public TargetMetric convertToEntityAttribute(String dbData) {
		return dbData == null ? null : TargetMetric.valueOf(dbData.toUpperCase());
	}
}