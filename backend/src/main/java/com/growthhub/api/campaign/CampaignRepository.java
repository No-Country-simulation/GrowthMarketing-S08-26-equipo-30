package com.growthhub.api.campaign;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CampaignRepository extends JpaRepository<Campaign, String> {

	Optional<Campaign> findByNameKey(String nameKey);

	boolean existsByNameKey(String nameKey);

	@Query("""
			select distinct c from Campaign c
			left join c.channels ch
			where c.archivedAt is null
			  and (:from is null or c.endDate >= :from)
			  and (:to is null or c.startDate <= :to)
			  and (:channelId is null or ch.id = :channelId)
			order by c.startDate desc, c.name asc
			""")
	List<Campaign> findVisible(@Param("from") LocalDate from,
			@Param("to") LocalDate to, @Param("channelId") Long channelId);
}
