package com.growthhub.api.campaign;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CampaignRepository extends JpaRepository<Campaign, String> {

	Optional<Campaign> findByNameKey(String nameKey);

	boolean existsByNameKey(String nameKey);
}