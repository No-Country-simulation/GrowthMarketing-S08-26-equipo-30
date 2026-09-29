package com.growthhub.api.campaign;

import com.growthhub.api.campaign.dto.CampaignRequest;
import com.growthhub.api.campaign.dto.CampaignResponse;
import com.growthhub.api.campaign.dto.CampaignStatusRequest;
import com.growthhub.api.campaign.dto.ChannelResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CampaignController {

	private final CampaignService campaignService;

	public CampaignController(CampaignService campaignService) {
		this.campaignService = campaignService;
	}

	@GetMapping("/channels")
	public List<ChannelResponse> listChannels() {
		return campaignService.listChannels();
	}

	@GetMapping("/campaigns")
	public List<CampaignResponse> listCampaigns(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
			@RequestParam(required = false) Long channelId) {
		return campaignService.listCampaigns(from, to, channelId);
	}

	@GetMapping("/campaigns/{id}")
	public CampaignResponse getCampaign(@PathVariable String id) {
		return campaignService.getCampaign(id);
	}

	@PostMapping("/campaigns")
	@ResponseStatus(HttpStatus.CREATED)
	public CampaignResponse createCampaign(@Valid @RequestBody CampaignRequest request) {
		return campaignService.createCampaign(request);
	}

	@PutMapping("/campaigns/{id}")
	public CampaignResponse updateCampaign(@PathVariable String id, @Valid @RequestBody CampaignRequest request) {
		return campaignService.updateCampaign(id, request);
	}

	@PatchMapping("/campaigns/{id}/status")
	public CampaignResponse updateStatus(@PathVariable String id, @Valid @RequestBody CampaignStatusRequest request) {
		return campaignService.updateStatus(id, request.status());
	}

	@DeleteMapping("/campaigns/{id}")
	public CampaignResponse archive(@PathVariable String id) {
		return campaignService.archive(id);
	}
}
