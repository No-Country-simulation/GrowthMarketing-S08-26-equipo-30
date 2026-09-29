package com.growthhub.api.experiment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExperimentRunRepository extends JpaRepository<ExperimentRun, Long> {
	List<ExperimentRun> findByExperimentIdOrderByRunNumberDesc(String experimentId);
	Optional<ExperimentRun> findFirstByExperimentIdAndStatusOrderByRunNumberDesc(String experimentId, ExperimentStatus status);
	int countByExperimentId(String experimentId);
}
