from fastapi import FastAPI

from backend.app.routers.campaigns import router as campaigns_router
from backend.app.routers.funnel import router as funnel_router
from backend.core.config import get_settings
from backend.core.lifespan import lifespan

settings = get_settings()

app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.include_router(campaigns_router, prefix="/api/campaigns", tags=["campaigns"])
app.include_router(funnel_router, prefix="/api/funnel", tags=["funnel"])


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
