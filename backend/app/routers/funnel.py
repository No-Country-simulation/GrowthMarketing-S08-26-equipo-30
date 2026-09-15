from fastapi import APIRouter, Depends, Request

from backend.repositories.contracts import FunnelRepository
from backend.schemas.funnel import FunnelSummaryResponse
from backend.services.funnel import FunnelService


def get_funnel_repository(request: Request) -> FunnelRepository:
    return request.app.state.funnel_repository


def get_funnel_service(
    repository: FunnelRepository = Depends(get_funnel_repository),
) -> FunnelService:
    return FunnelService(repository)


router = APIRouter()


@router.get("", response_model=FunnelSummaryResponse)
def get_funnel_summary(
    service: FunnelService = Depends(get_funnel_service),
) -> dict:
    return service.get_summary()
