from copy import deepcopy
from uuid import uuid4

from backend.shared.constants.campaigns import CAMPAIGN_STATUS_ACTIVE, DEFAULT_CAMPAIGN_METRICS


class InMemoryCampaignRepository:
    def __init__(self) -> None:
        self._campaigns: dict[str, dict] = {}

    def reset(self) -> None:
        self._campaigns.clear()

    def list(self) -> list[dict]:
        return [deepcopy(campaign) for campaign in self._campaigns.values()]

    def get(self, campaign_id: str) -> dict | None:
        campaign = self._campaigns.get(campaign_id)
        return deepcopy(campaign) if campaign is not None else None

    def get_by_name(self, name: str) -> dict | None:
        normalized = name.strip().lower()
        for campaign in self._campaigns.values():
            if campaign["name"].strip().lower() == normalized:
                return deepcopy(campaign)
        return None

    def create(self, data: dict) -> dict:
        campaign = {
            **data,
            "id": data.get("id") or uuid4().hex,
            "status": data.get("status") or CAMPAIGN_STATUS_ACTIVE,
            "metrics": data.get("metrics") or dict(DEFAULT_CAMPAIGN_METRICS),
        }
        self._campaigns[campaign["id"]] = campaign
        return deepcopy(campaign)

    def update(self, campaign_id: str, data: dict) -> dict:
        campaign = self._campaigns[campaign_id]
        campaign.update(data)
        return deepcopy(campaign)
