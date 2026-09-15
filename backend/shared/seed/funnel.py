import json
from pathlib import Path

from backend.repositories.contracts import FunnelRepository
from backend.schemas.funnel import FunnelEventSeed

DEMO_FUNNEL_EVENTS_PATH = (
    Path(__file__).resolve().parent.parent / "data" / "demo_funnel_events.json"
)


def load_demo_funnel_events() -> list[FunnelEventSeed]:
    raw = json.loads(DEMO_FUNNEL_EVENTS_PATH.read_text(encoding="utf-8"))
    return [FunnelEventSeed.model_validate(item) for item in raw]


def seed_funnel_events(repository: FunnelRepository) -> list[dict]:
    events = [event.model_dump() for event in load_demo_funnel_events()]
    return repository.create_many(events)
