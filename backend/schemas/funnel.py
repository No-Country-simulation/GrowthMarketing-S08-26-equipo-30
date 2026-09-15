from datetime import date

from pydantic import BaseModel, field_validator

from backend.shared.constants.funnel import ERROR_INVALID_STAGE, FUNNEL_STAGE_KEYS


class FunnelEventSeed(BaseModel):
    user_id: str
    stage: str
    channel: str
    campaign_name: str
    event_date: date

    @field_validator("stage")
    @classmethod
    def _validate_stage(cls, value: str) -> str:
        if value not in FUNNEL_STAGE_KEYS:
            raise ValueError(ERROR_INVALID_STAGE)
        return value


class FunnelStageSummary(BaseModel):
    key: str
    label: str
    users: int
    next_stage_users: int
    conversion_rate: float


class FunnelLeakPoint(BaseModel):
    from_stage: str
    to_stage: str
    dropoff_users: int
    dropoff_rate: float


class FunnelSummaryResponse(BaseModel):
    stages: list[FunnelStageSummary]
    leak_point: FunnelLeakPoint | None
    total_users: int
