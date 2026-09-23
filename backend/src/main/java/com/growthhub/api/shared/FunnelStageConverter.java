package com.growthhub.api.shared;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class FunnelStageConverter implements AttributeConverter<FunnelStage, String> {

	@Override
	public String convertToDatabaseColumn(FunnelStage attribute) {
		return attribute == null ? null : attribute.name().toLowerCase();
	}

	@Override
	public FunnelStage convertToEntityAttribute(String dbData) {
		return dbData == null ? null : FunnelStage.valueOf(dbData.toUpperCase());
	}
}