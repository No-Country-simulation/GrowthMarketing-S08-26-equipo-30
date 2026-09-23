package com.growthhub.api.tracking;

import com.growthhub.api.shared.FunnelStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

	@Query("select distinct e.stage from Event e where e.user.id = :userId")
	List<FunnelStage> findDistinctStagesByUserId(@Param("userId") String userId);

	@Query("select distinct e.user.id, e.stage from Event e")
	List<Object[]> findDistinctUserStages();

	@Query("select e from Event e join fetch e.channel join fetch e.user order by e.eventDate asc, e.id asc")
	List<Event> findAllOrdered();
}