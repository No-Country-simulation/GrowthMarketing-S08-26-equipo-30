package com.growthhub.api.experiment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperimentRepository extends JpaRepository<Experiment, String> {

	List<Experiment> findAllByOrderByStartedAtDescIdAsc();
}