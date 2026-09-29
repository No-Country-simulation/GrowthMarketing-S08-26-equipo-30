package com.growthhub.api.tracking;

import com.growthhub.api.shared.FunnelStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

	interface SegmentEventView {
		String getUserId();
		FunnelStage getStage();
		Long getChannelId();
		String getChannelName();
		LocalDate getEventDate();
		Long getId();
	}

	@Query("select distinct e.stage from Event e where e.user.id = :userId")
	List<FunnelStage> findDistinctStagesByUserId(@Param("userId") String userId);

	@Query("select distinct e.user.id, e.stage from Event e")
	List<Object[]> findDistinctUserStages();

	@Query("""
			select e.user.id as userId,
			       e.stage as stage,
			       e.channel.id as channelId,
			       e.channel.name as channelName,
			       e.eventDate as eventDate,
			       e.id as id
			from Event e
			order by e.eventDate asc, e.id asc
			""")
	List<SegmentEventView> findEventsForSegments();

	@Query("select e.stage, count(distinct e.user.id) from Event e where e.campaign.id = :campaignId group by e.stage")
	List<Object[]> countStagesByCampaign(@Param("campaignId") String campaignId);
}
