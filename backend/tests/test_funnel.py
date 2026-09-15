import pytest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.routers.funnel import get_funnel_repository
from backend.repositories.funnel import InMemoryFunnelRepository
from backend.shared.seed.funnel import seed_funnel_events

client = TestClient(app)

STAGE_KEYS = ["visita", "registro", "activacion", "interaccion", "conversion", "retencion"]


@pytest.fixture
def funnel_repository():
    repository = InMemoryFunnelRepository()
    seed_funnel_events(repository)
    app.dependency_overrides[get_funnel_repository] = lambda: repository
    yield repository
    app.dependency_overrides.clear()


@pytest.fixture
def empty_funnel_repository():
    repository = InMemoryFunnelRepository()
    app.dependency_overrides[get_funnel_repository] = lambda: repository
    yield repository
    app.dependency_overrides.clear()


def test_get_funnel_returns_200(funnel_repository):
    response = client.get("/api/funnel")
    assert response.status_code == 200


def test_funnel_has_six_stages_in_fixed_order(funnel_repository):
    stages = client.get("/api/funnel").json()["stages"]
    assert [stage["key"] for stage in stages] == STAGE_KEYS
    assert len(stages) == 6


def test_total_users_greater_than_zero(funnel_repository):
    body = client.get("/api/funnel").json()
    assert body["total_users"] > 0


def test_stage_fields_and_rates(funnel_repository):
    stages = client.get("/api/funnel").json()["stages"]
    for stage in stages:
        assert {"key", "label", "users", "next_stage_users", "conversion_rate"} <= set(
            stage
        )
        assert stage["users"] >= 0
        assert stage["next_stage_users"] >= 0
        assert 0 <= stage["conversion_rate"] <= 1


def test_leak_point_exists_with_required_fields(funnel_repository):
    leak_point = client.get("/api/funnel").json()["leak_point"]
    assert leak_point is not None
    assert {"from_stage", "to_stage", "dropoff_users", "dropoff_rate"} <= set(
        leak_point
    )
    assert leak_point["dropoff_users"] > 0
    assert 0 <= leak_point["dropoff_rate"] <= 1


def test_empty_repository_returns_zeroed_stages(empty_funnel_repository):
    body = client.get("/api/funnel").json()
    assert [stage["key"] for stage in body["stages"]] == STAGE_KEYS
    assert all(stage["users"] == 0 for stage in body["stages"])
    assert all(stage["next_stage_users"] == 0 for stage in body["stages"])
    assert all(stage["conversion_rate"] == 0 for stage in body["stages"])
    assert body["leak_point"] is None
    assert body["total_users"] == 0
