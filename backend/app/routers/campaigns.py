from fastapi import APIRouter, Depends, HTTPException, Request, status

from backend.repositories.contracts import CampaignRepository
from backend.schemas.campaigns import CampaignCreate, CampaignResponse, CampaignUpdate
from backend.services.campaigns import (
    CampaignNotFoundError,
    CampaignService,
    DuplicateCampaignNameError,
    InvalidCampaignError,
)
from backend.shared.constants.campaigns import ERROR_CAMPAIGN_NOT_FOUND, ERROR_DUPLICATE_NAME


def get_campaign_repository(request: Request) -> CampaignRepository:
    return request.app.state.campaign_repository


def get_campaign_service(
    repository: CampaignRepository = Depends(get_campaign_repository),
) -> CampaignService:
    return CampaignService(repository)


router = APIRouter()


@router.get("", response_model=list[CampaignResponse])
def list_campaigns(
    service: CampaignService = Depends(get_campaign_service),
) -> list[dict]:
    return service.list_campaigns()


@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign(
    campaign_id: str,
    service: CampaignService = Depends(get_campaign_service),
) -> dict:
    try:
        return service.get_campaign(campaign_id)
    except CampaignNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ERROR_CAMPAIGN_NOT_FOUND,
        )


@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(
    data: CampaignCreate,
    service: CampaignService = Depends(get_campaign_service),
) -> dict:
    try:
        return service.create_campaign(data)
    except DuplicateCampaignNameError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=ERROR_DUPLICATE_NAME,
        )
    except InvalidCampaignError as error:
        raise HTTPException(status_code=422, detail=str(error))


@router.put("/{campaign_id}", response_model=CampaignResponse)
def update_campaign(
    campaign_id: str,
    data: CampaignUpdate,
    service: CampaignService = Depends(get_campaign_service),
) -> dict:
    try:
        return service.update_campaign(campaign_id, data)
    except CampaignNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ERROR_CAMPAIGN_NOT_FOUND,
        )
    except DuplicateCampaignNameError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=ERROR_DUPLICATE_NAME,
        )
    except InvalidCampaignError as error:
        raise HTTPException(status_code=422, detail=str(error))
