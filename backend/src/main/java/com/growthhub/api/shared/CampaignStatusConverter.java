package com.growthhub.api.shared;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CampaignStatusConverter implements AttributeConverter<CampaignStatus, String> {

	@Override
	public String convertToDatabaseColumn(CampaignStatus attribute) {
		return attribute == null ? null : attribute.name().toLowerCase();
	}

	@Override
	public CampaignStatus convertToEntityAttribute(String dbData) {
		return dbData == null ? null : CampaignStatus.valueOf(dbData.toUpperCase());
	}
}