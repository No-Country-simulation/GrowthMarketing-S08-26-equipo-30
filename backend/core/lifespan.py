from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI

from backend.core.config import get_settings
from backend.repositories.campaigns import InMemoryCampaignRepository
from backend.repositories.funnel import InMemoryFunnelRepository
from backend.shared.seed.campaigns import seed_campaigns
from backend.shared.seed.funnel import seed_funnel_events


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()

    campaign_repository = InMemoryCampaignRepository()
    if settings.load_demo_data:
        seed_campaigns(campaign_repository)
    app.state.campaign_repository = campaign_repository

    funnel_repository = InMemoryFunnelRepository()
    if settings.load_demo_data:
        seed_funnel_events(funnel_repository)
    app.state.funnel_repository = funnel_repository

    yield
