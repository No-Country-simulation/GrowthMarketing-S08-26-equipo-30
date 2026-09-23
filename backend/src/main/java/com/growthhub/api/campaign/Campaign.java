package com.growthhub.api.campaign;

import com.growthhub.api.shared.CampaignStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campaigns")
@Getter
@Setter
public class Campaign {

	@Id
	@Column(length = 32)
	private String id;

	@Column(nullable = false)
	private String name;

	@Column(name = "name_key", nullable = false, unique = true)
	private String nameKey;

	@Column(nullable = false)
	private String objective;

	@Column(nullable = false, precision = 18, scale = 2)
	private BigDecimal budget;

	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;

	@Column(nullable = false, length = 20)
	private CampaignStatus status = CampaignStatus.ACTIVA;

	@Column(name = "is_demo", nullable = false)
	private boolean demo = false;

	@Column(name = "archived_at")
	private Instant archivedAt;

	@Column(name = "meta_account_id", length = 100)
	private String metaAccountId;

	@Column(name = "meta_campaign_id", length = 100)
	private String metaCampaignId;

	@Column(name = "last_sync_attempt_at")
	private Instant lastSyncAttemptAt;

	@Column(name = "last_sync_success_at")
	private Instant lastSyncSuccessAt;

	@Column(name = "last_sync_error")
	private String lastSyncError;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
			name = "campaign_channels",
			joinColumns = @JoinColumn(name = "campaign_id"),
			inverseJoinColumns = @JoinColumn(name = "channel_id"))
	@OrderColumn(name = "position")
	private List<Channel> channels = new ArrayList<>();
}