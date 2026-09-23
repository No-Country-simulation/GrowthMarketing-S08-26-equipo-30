package com.growthhub.api.campaign;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CampaignMetricRepository extends JpaRepository<CampaignMetric, Long> {

	Optional<CampaignMetric> findTopByCampaign_IdOrderByCapturedAtDesc(String campaignId);
}