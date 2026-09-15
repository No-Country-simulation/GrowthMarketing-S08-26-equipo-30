from datetime import date

from pydantic import BaseModel, Field, field_validator, model_validator

from .constants import (
    ALLOWED_CAMPAIGN_STATUSES,
    CAMPAIGN_STATUS_ACTIVE,
    DEFAULT_METRIC_CLICKS,
    DEFAULT_METRIC_CONVERSIONS,
    DEFAULT_METRIC_COST_PER_RESULT,
    DEFAULT_METRIC_IMPRESSIONS,
    DEFAULT_METRIC_REACH,
    ERROR_BUDGET_NEGATIVE,
    ERROR_CHANNELS_REQUIRED,
    ERROR_DATE_RANGE,
    ERROR_NAME_REQUIRED,
    ERROR_OBJECTIVE_REQUIRED,
    ERROR_STATUS_INVALID,
    MIN_CAMPAIGN_BUDGET,
    MIN_CAMPAIGN_CHANNELS,
)


class CampaignMetrics(BaseModel):
    reach: int = DEFAULT_METRIC_REACH
    impressions: int = DEFAULT_METRIC_IMPRESSIONS
    clicks: int = DEFAULT_METRIC_CLICKS
    conversions: int = DEFAULT_METRIC_CONVERSIONS
    cost_per_result: float = DEFAULT_METRIC_COST_PER_RESULT


class CampaignCreate(BaseModel):
    name: str
    objective: str
    budget: float
    start_date: date
    end_date: date
    channels: list[str]

    @field_validator("name")
    @classmethod
    def _validate_name(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError(ERROR_NAME_REQUIRED)
        return value.strip()

    @field_validator("objective")
    @classmethod
    def _validate_objective(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError(ERROR_OBJECTIVE_REQUIRED)
        return value.strip()

    @field_validator("budget")
    @classmethod
    def _validate_budget(cls, value: float) -> float:
        if value < MIN_CAMPAIGN_BUDGET:
            raise ValueError(ERROR_BUDGET_NEGATIVE)
        return value

    @field_validator("channels")
    @classmethod
    def _validate_channels(cls, value: list[str]) -> list[str]:
        if len(value) < MIN_CAMPAIGN_CHANNELS:
            raise ValueError(ERROR_CHANNELS_REQUIRED)
        return value

    @model_validator(mode="after")
    def _validate_date_range(self) -> "CampaignCreate":
        if self.end_date < self.start_date:
            raise ValueError(ERROR_DATE_RANGE)
        return self


class CampaignUpdate(BaseModel):
    name: str | None = None
    objective: str | None = None
    budget: float | None = None
    start_date: date | None = None
    end_date: date | None = None
    channels: list[str] | None = None

    @field_validator("name")
    @classmethod
    def _validate_name(cls, value: str | None) -> str | None:
        if value is None:
            return value
        if not value.strip():
            raise ValueError(ERROR_NAME_REQUIRED)
        return value.strip()

    @field_validator("objective")
    @classmethod
    def _validate_objective(cls, value: str | None) -> str | None:
        if value is None:
            return value
        if not value.strip():
            raise ValueError(ERROR_OBJECTIVE_REQUIRED)
        return value.strip()

    @field_validator("budget")
    @classmethod
    def _validate_budget(cls, value: float | None) -> float | None:
        if value is None:
            return value
        if value < MIN_CAMPAIGN_BUDGET:
            raise ValueError(ERROR_BUDGET_NEGATIVE)
        return value

    @field_validator("channels")
    @classmethod
    def _validate_channels(cls, value: list[str] | None) -> list[str] | None:
        if value is None:
            return value
        if len(value) < MIN_CAMPAIGN_CHANNELS:
            raise ValueError(ERROR_CHANNELS_REQUIRED)
        return value

    @model_validator(mode="after")
    def _validate_date_range(self) -> "CampaignUpdate":
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError(ERROR_DATE_RANGE)
        return self


class CampaignSeed(CampaignCreate):
    status: str = CAMPAIGN_STATUS_ACTIVE
    metrics: CampaignMetrics = Field(default_factory=CampaignMetrics)

    @field_validator("status")
    @classmethod
    def _validate_status(cls, value: str) -> str:
        if value not in ALLOWED_CAMPAIGN_STATUSES:
            raise ValueError(ERROR_STATUS_INVALID)
        return value


class CampaignResponse(BaseModel):
    id: str
    name: str
    objective: str
    budget: float
    start_date: date
    end_date: date
    channels: list[str]
    status: str
    metrics: CampaignMetrics
