package com.growthhub.api.shared;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MetricSourceConverter implements AttributeConverter<MetricSource, String> {

	@Override
	public String convertToDatabaseColumn(MetricSource attribute) {
		return attribute == null ? null : attribute.name().toLowerCase();
	}

	@Override
	public MetricSource convertToEntityAttribute(String dbData) {
		return dbData == null ? null : MetricSource.valueOf(dbData.toUpperCase());
	}
}