from backend.repositories.contracts import CampaignRepository
from backend.schemas.campaigns import CampaignCreate, CampaignUpdate
from backend.shared.constants.campaigns import (
    ERROR_BUDGET_NEGATIVE,
    ERROR_CAMPAIGN_NOT_FOUND,
    ERROR_CHANNELS_REQUIRED,
    ERROR_DATE_RANGE,
    ERROR_DUPLICATE_NAME,
    ERROR_NAME_REQUIRED,
    ERROR_OBJECTIVE_REQUIRED,
    MIN_CAMPAIGN_BUDGET,
    MIN_CAMPAIGN_CHANNELS,
)


class CampaignError(Exception):
    """Error base del modulo de campaÃ±as."""


class CampaignNotFoundError(CampaignError):
    """La campaÃ±a solicitada no existe."""


class DuplicateCampaignNameError(CampaignError):
    """Ya existe una campaÃ±a con el mismo nombre."""


class InvalidCampaignError(CampaignError):
    """Los datos de la campaÃ±a no cumplen las reglas de negocio."""


class CampaignService:
    def __init__(self, repository: CampaignRepository) -> None:
        self.repository = repository

    def list_campaigns(self) -> list[dict]:
        return self.repository.list()

    def get_campaign(self, campaign_id: str) -> dict:
        campaign = self.repository.get(campaign_id)
        if campaign is None:
            raise CampaignNotFoundError(ERROR_CAMPAIGN_NOT_FOUND)
        return campaign

    def create_campaign(self, data: CampaignCreate) -> dict:
        if self.repository.get_by_name(data.name) is not None:
            raise DuplicateCampaignNameError(ERROR_DUPLICATE_NAME)
        return self.repository.create(data.model_dump())

    def update_campaign(self, campaign_id: str, data: CampaignUpdate) -> dict:
        existing = self.get_campaign(campaign_id)
        changes = data.model_dump(exclude_unset=True)

        new_name = changes.get("name")
        if (
            new_name is not None
            and new_name.strip().lower() != existing["name"].strip().lower()
        ):
            duplicate = self.repository.get_by_name(new_name)
            if duplicate is not None and duplicate["id"] != campaign_id:
                raise DuplicateCampaignNameError(ERROR_DUPLICATE_NAME)

        self._validate_merged(existing, changes)

        return self.repository.update(campaign_id, changes)

    def _validate_merged(self, existing: dict, changes: dict) -> None:
        name = changes.get("name", existing["name"])
        objective = changes.get("objective", existing["objective"])
        budget = changes.get("budget", existing["budget"])
        start_date = changes.get("start_date", existing["start_date"])
        end_date = changes.get("end_date", existing["end_date"])
        channels = changes.get("channels", existing["channels"])

        if not name or not name.strip():
            raise InvalidCampaignError(ERROR_NAME_REQUIRED)
        if not objective or not objective.strip():
            raise InvalidCampaignError(ERROR_OBJECTIVE_REQUIRED)
        if len(channels) < MIN_CAMPAIGN_CHANNELS:
            raise InvalidCampaignError(ERROR_CHANNELS_REQUIRED)
        if budget < MIN_CAMPAIGN_BUDGET:
            raise InvalidCampaignError(ERROR_BUDGET_NEGATIVE)
        if end_date < start_date:
            raise InvalidCampaignError(ERROR_DATE_RANGE)
