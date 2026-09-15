import pytest
from fastapi.testclient import TestClient

from app.campaigns.repository import InMemoryCampaignRepository
from app.campaigns.router import get_campaign_repository
from app.campaigns.seed import load_demo_campaigns, seed_campaigns
from app.core.config import get_settings
from app.main import app

client = TestClient(app)


@pytest.fixture
def repository():
    repo = InMemoryCampaignRepository()
    seed_campaigns(repo)
    app.dependency_overrides[get_campaign_repository] = lambda: repo
    yield repo
    app.dependency_overrides.clear()


def valid_payload(**overrides):
    payload = {
        "name": "Campaña de prueba",
        "objective": "200 registros",
        "budget": 1500.0,
        "start_date": "2026-10-01",
        "end_date": "2026-10-31",
        "channels": ["Instagram Ads"],
    }
    payload.update(overrides)
    return payload


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_lifespan_seeds_demo_data_when_enabled():
    assert get_settings().load_demo_data is True
    with TestClient(app) as lifespan_client:
        response = lifespan_client.get("/api/campaigns")
    assert response.status_code == 200
    returned = {campaign["name"] for campaign in response.json()}
    expected = {campaign.name for campaign in load_demo_campaigns()}
    assert returned == expected
    assert len(expected) >= 3


def test_list_campaigns_returns_demo_data(repository):
    response = client.get("/api/campaigns")
    assert response.status_code == 200
    returned = {campaign["name"] for campaign in response.json()}
    expected = {campaign.name for campaign in load_demo_campaigns()}
    assert returned == expected


def test_get_existing_campaign(repository):
    campaign_id = client.get("/api/campaigns").json()[0]["id"]
    response = client.get(f"/api/campaigns/{campaign_id}")
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == campaign_id
    assert "metrics" in body


def test_get_unknown_campaign_returns_404(repository):
    response = client.get("/api/campaigns/no-existe")
    assert response.status_code == 404


def test_create_valid_campaign(repository):
    response = client.post("/api/campaigns", json=valid_payload())
    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Campaña de prueba"
    assert body["channels"] == ["Instagram Ads"]
    assert body["status"] == "activa"
    assert body["metrics"]["conversions"] == 0


def test_reject_blank_name(repository):
    response = client.post("/api/campaigns", json=valid_payload(name="   "))
    assert response.status_code == 422


def test_reject_blank_objective(repository):
    response = client.post("/api/campaigns", json=valid_payload(objective=""))
    assert response.status_code == 422


def test_reject_negative_budget(repository):
    response = client.post("/api/campaigns", json=valid_payload(budget=-1))
    assert response.status_code == 422


def test_reject_without_channels(repository):
    response = client.post("/api/campaigns", json=valid_payload(channels=[]))
    assert response.status_code == 422


def test_reject_end_date_before_start_date(repository):
    response = client.post(
        "/api/campaigns",
        json=valid_payload(start_date="2026-10-31", end_date="2026-10-01"),
    )
    assert response.status_code == 422


def test_reject_duplicate_name_on_post(repository):
    response = client.post(
        "/api/campaigns", json=valid_payload(name="Lanzamiento verano")
    )
    assert response.status_code == 409


def test_reject_duplicate_name_on_put(repository):
    campaigns = client.get("/api/campaigns").json()
    first_id = campaigns[0]["id"]
    other_name = campaigns[1]["name"]
    response = client.put(f"/api/campaigns/{first_id}", json={"name": other_name})
    assert response.status_code == 409


def test_update_campaign_basic_data(repository):
    campaign_id = client.get("/api/campaigns").json()[0]["id"]
    response = client.put(
        f"/api/campaigns/{campaign_id}",
        json={"objective": "1000 registros", "budget": 9000.0},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["objective"] == "1000 registros"
    assert body["budget"] == 9000.0


def test_update_campaign_preserves_metrics(repository):
    campaign_id = client.get("/api/campaigns").json()[0]["id"]
    before = client.get(f"/api/campaigns/{campaign_id}").json()["metrics"]

    response = client.put(
        f"/api/campaigns/{campaign_id}", json={"objective": "nuevo objetivo"}
    )
    assert response.status_code == 200
    assert response.json()["metrics"] == before


def test_update_campaign_with_invalid_date_range_fails(repository):
    campaign_id = client.get("/api/campaigns").json()[0]["id"]
    response = client.put(
        f"/api/campaigns/{campaign_id}",
        json={"start_date": "2026-12-01", "end_date": "2026-11-01"},
    )
    assert response.status_code == 422
