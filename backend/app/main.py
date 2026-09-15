from fastapi import FastAPI

from app.campaigns.router import router as campaigns_router
from app.core.config import get_settings
from app.core.lifespan import lifespan

settings = get_settings()

app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.include_router(campaigns_router, prefix="/api/campaigns", tags=["campaigns"])


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
