package com.growthhub.api.experiment;

import com.growthhub.api.experiment.dto.CloseExperimentRequest;
import com.growthhub.api.experiment.dto.ExperimentRequest;
import com.growthhub.api.experiment.dto.ExperimentResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/experiments")
public class ExperimentController {

	private final ExperimentService experimentService;

	public ExperimentController(ExperimentService experimentService) {
		this.experimentService = experimentService;
	}

	@GetMapping
	public List<ExperimentResponse> listExperiments() {
		return experimentService.listExperiments();
	}

	@GetMapping("/{id}")
	public ExperimentResponse getExperiment(@PathVariable String id) {
		return experimentService.getExperiment(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ExperimentResponse createExperiment(@Valid @RequestBody ExperimentRequest request) {
		return experimentService.createExperiment(request);
	}

	@PutMapping("/{id}")
	public ExperimentResponse updateExperiment(@PathVariable String id, @Valid @RequestBody ExperimentRequest request) {
		return experimentService.updateExperiment(id, request);
	}

	@PostMapping("/{id}/start")
	public ExperimentResponse startExperiment(@PathVariable String id) {
		return experimentService.startExperiment(id);
	}

	@PostMapping("/{id}/close")
	public ExperimentResponse closeExperiment(@PathVariable String id,
			@Valid @RequestBody CloseExperimentRequest request) {
		return experimentService.closeExperiment(id, request);
	}

	@PostMapping("/{id}/cancel")
	public ExperimentResponse cancelExperiment(@PathVariable String id) {
		return experimentService.cancelExperiment(id);
	}
}