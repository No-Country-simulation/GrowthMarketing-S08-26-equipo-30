from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI

from app.campaigns.repository import InMemoryCampaignRepository
from app.campaigns.seed import seed_campaigns
from app.core.config import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    repository = InMemoryCampaignRepository()
    if settings.load_demo_data:
        seed_campaigns(repository)
    app.state.campaign_repository = repository
    yield
