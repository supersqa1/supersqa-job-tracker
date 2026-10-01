import pytest
from fastapi.testclient import TestClient


def create_application(
    client: TestClient,
    auth_headers: dict[str, str],
    **overrides: object,
) -> dict[str, object]:
    payload = {
        "company_name": "Acme",
        "role_title": "Senior QA Engineer",
        "status": "potential",
        "location": "Remote",
        "remote_type": "remote",
    } | overrides

    response = client.post("/api/applications", json=payload, headers=auth_headers)

    assert response.status_code == 201
    return response.json()


def test_health_and_root_endpoints_are_available(client: TestClient):
    health_response = client.get("/api/health")
    root_response = client.get("/")

    assert health_response.status_code == 200
    assert health_response.json() == {"status": "ok"}
    assert root_response.status_code == 200
    assert root_response.json()["docs"] == "/docs"


def test_application_endpoints_require_authentication(client: TestClient):
    response = client.get("/api/applications")

    assert response.status_code == 401


def test_create_and_read_application_round_trip(
    client: TestClient,
    auth_headers: dict[str, str],
):
    created = create_application(
        client,
        auth_headers,
        company_name="Globex",
        role_title="Automation Lead",
        status="applied",
        remote_type="hybrid",
        salary_range="$150k-$170k",
        notes="Hiring manager screen next",
    )

    response = client.get(f"/api/applications/{created['id']}", headers=auth_headers)

    assert response.status_code == 200
    application = response.json()
    assert application["id"] == created["id"]
    assert application["user_id"] == 1
    assert application["company_name"] == "Globex"
    assert application["role_title"] == "Automation Lead"
    assert application["status"] == "applied"
    assert application["remote_type"] == "hybrid"
    assert application["salary_range"] == "$150k-$170k"
    assert application["notes"] == "Hiring manager screen next"
    assert application["created_at"]
    assert application["updated_at"]


def test_list_applications_supports_status_filter_and_search(
    client: TestClient,
    auth_headers: dict[str, str],
):
    create_application(
        client,
        auth_headers,
        company_name="Acme",
        role_title="Backend QA",
        status="applied",
    )
    create_application(
        client,
        auth_headers,
        company_name="Globex",
        role_title="Frontend QA",
        status="potential",
    )
    create_application(
        client,
        auth_headers,
        company_name="Initech",
        role_title="SDET",
        status="applied",
    )

    applied_response = client.get(
        "/api/applications",
        params={"status": "applied"},
        headers=auth_headers,
    )
    search_response = client.get(
        "/api/applications",
        params={"search": "front"},
        headers=auth_headers,
    )
    combined_response = client.get(
        "/api/applications",
        params={"status": "applied", "search": "qa"},
        headers=auth_headers,
    )

    assert applied_response.status_code == 200
    assert {item["company_name"] for item in applied_response.json()} == {"Acme", "Initech"}

    assert search_response.status_code == 200
    assert [item["company_name"] for item in search_response.json()] == ["Globex"]

    assert combined_response.status_code == 200
    assert [item["company_name"] for item in combined_response.json()] == ["Acme"]


def test_summary_counts_all_pipeline_statuses(
    client: TestClient,
    auth_headers: dict[str, str],
):
    create_application(client, auth_headers, company_name="Acme", status="potential")
    create_application(client, auth_headers, company_name="Globex", status="applied")
    create_application(client, auth_headers, company_name="Initech", status="applied")
    create_application(client, auth_headers, company_name="Umbrella", status="in_progress")
    create_application(client, auth_headers, company_name="Soylent", status="rejected")

    response = client.get("/api/applications/summary", headers=auth_headers)

    assert response.status_code == 200
    assert response.json() == {
        "potential": 1,
        "applied": 2,
        "in_progress": 1,
        "final_stage": 0,
        "hired": 0,
        "rejected": 1,
        "withdrawn": 0,
        "total": 5,
    }


def test_patch_application_updates_only_supplied_fields_and_allows_nullable_fields(
    client: TestClient,
    auth_headers: dict[str, str],
):
    created = create_application(
        client,
        auth_headers,
        company_name="Acme",
        role_title="QA Engineer",
        status="potential",
        remote_type="remote",
        notes="Preserve me",
    )

    response = client.patch(
        f"/api/applications/{created['id']}",
        json={
            "company_name": "Acme Labs",
            "status": "in_progress",
            "remote_type": None,
        },
        headers=auth_headers,
    )

    assert response.status_code == 200
    updated = response.json()
    assert updated["company_name"] == "Acme Labs"
    assert updated["role_title"] == "QA Engineer"
    assert updated["status"] == "in_progress"
    assert updated["remote_type"] is None
    assert updated["notes"] == "Preserve me"


def test_delete_application_removes_it_from_collection(
    client: TestClient,
    auth_headers: dict[str, str],
):
    created = create_application(client, auth_headers)

    delete_response = client.delete(f"/api/applications/{created['id']}", headers=auth_headers)
    get_response = client.get(f"/api/applications/{created['id']}", headers=auth_headers)
    list_response = client.get("/api/applications", headers=auth_headers)

    assert delete_response.status_code == 204
    assert delete_response.content == b""
    assert get_response.status_code == 404
    assert list_response.json() == []


@pytest.mark.parametrize(
    ("method", "path"),
    [
        ("get", "/api/applications/999"),
        ("patch", "/api/applications/999"),
        ("delete", "/api/applications/999"),
    ],
)
def test_missing_application_returns_404(
    client: TestClient,
    auth_headers: dict[str, str],
    method: str,
    path: str,
):
    request = getattr(client, method)
    kwargs = {"json": {"status": "applied"}} if method == "patch" else {}

    response = request(path, **kwargs, headers=auth_headers)

    assert response.status_code == 404
    assert response.json() == {"detail": "Application not found"}


@pytest.mark.parametrize(
    "payload",
    [
        {"company_name": "", "role_title": "SDET"},
        {"company_name": "Acme", "role_title": ""},
        {"company_name": "Acme", "role_title": "SDET", "status": "not-a-status"},
        {"company_name": "Acme", "role_title": "SDET", "remote_type": "elsewhere"},
    ],
)
def test_create_application_rejects_invalid_payloads(
    client: TestClient,
    auth_headers: dict[str, str],
    payload: dict[str, str],
):
    response = client.post("/api/applications", json=payload, headers=auth_headers)

    assert response.status_code == 422
