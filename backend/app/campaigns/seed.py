import json
from pathlib import Path

from .contracts import CampaignRepository
from .schemas import CampaignSeed

DEMO_CAMPAIGNS_PATH = Path(__file__).resolve().parent / "data" / "demo_campaigns.json"


def load_demo_campaigns() -> list[CampaignSeed]:
    raw = json.loads(DEMO_CAMPAIGNS_PATH.read_text(encoding="utf-8"))
    return [CampaignSeed.model_validate(item) for item in raw]


def seed_campaigns(repository: CampaignRepository) -> list[dict]:
    return [repository.create(campaign.model_dump()) for campaign in load_demo_campaigns()]
