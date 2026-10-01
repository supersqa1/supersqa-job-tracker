from fastapi.testclient import TestClient


def test_register_creates_user_and_returns_token(client: TestClient):
    register_response = client.post(
        "/api/auth/register",
        json={"username": "new-user", "password": "new-user-password"},
    )

    assert register_response.status_code == 201
    body = register_response.json()
    assert body["token_type"] == "bearer"
    assert body["expires_in"] > 0

    me_response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {body['access_token']}"},
    )

    assert me_response.status_code == 200
    assert me_response.json()["username"] == "new-user"


def test_register_rejects_duplicate_username(client: TestClient):
    response = client.post(
        "/api/auth/register",
        json={"username": "admin", "password": "another-password"},
    )

    assert response.status_code == 409
    assert response.json() == {"detail": "Username is already registered"}


def test_register_validates_trimmed_username_length(client: TestClient):
    response = client.post(
        "/api/auth/register",
        json={"username": "  ab  ", "password": "another-password"},
    )

    assert response.status_code == 422


def test_login_returns_token_and_current_user(client: TestClient):
    login_response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "admin123!"},
    )

    assert login_response.status_code == 200
    body = login_response.json()
    assert body["token_type"] == "bearer"
    assert body["expires_in"] > 0

    me_response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {body['access_token']}"},
    )

    assert me_response.status_code == 200
    assert me_response.json() == {
        "id": 1,
        "username": "admin",
        "is_active": True,
    }


def test_login_rejects_wrong_password(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid username or password"}


def test_login_rejects_inactive_user(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"username": "disabled", "password": "disabled123!"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid username or password"}


def test_me_requires_bearer_token(client: TestClient):
    response = client.get("/api/auth/me")

    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_me_rejects_malformed_token(client: TestClient):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer not-a-jwt"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Could not validate credentials"}


def test_protected_application_flow_requires_then_accepts_auth(
    client: TestClient,
    auth_headers: dict[str, str],
):
    unauthenticated_response = client.get("/api/applications")
    assert unauthenticated_response.status_code == 401

    create_response = client.post(
        "/api/applications",
        json={
            "company_name": "Auth Labs",
            "role_title": "Security QA Engineer",
            "status": "applied",
        },
        headers=auth_headers,
    )
    assert create_response.status_code == 201

    list_response = client.get("/api/applications", headers=auth_headers)
    assert list_response.status_code == 200
    assert [item["company_name"] for item in list_response.json()] == ["Auth Labs"]


def test_application_data_is_scoped_to_owning_user(
    client: TestClient,
    auth_headers: dict[str, str],
    second_user_headers: dict[str, str],
):
    first_user_create_response = client.post(
        "/api/applications",
        json={
            "company_name": "Private Co",
            "role_title": "QA Lead",
            "status": "applied",
        },
        headers=auth_headers,
    )
    assert first_user_create_response.status_code == 201
    application_id = first_user_create_response.json()["id"]

    second_user_list_response = client.get("/api/applications", headers=second_user_headers)
    second_user_get_response = client.get(
        f"/api/applications/{application_id}",
        headers=second_user_headers,
    )
    second_user_patch_response = client.patch(
        f"/api/applications/{application_id}",
        json={"status": "hired"},
        headers=second_user_headers,
    )
    second_user_delete_response = client.delete(
        f"/api/applications/{application_id}",
        headers=second_user_headers,
    )

    assert second_user_list_response.status_code == 200
    assert second_user_list_response.json() == []
    assert second_user_get_response.status_code == 404
    assert second_user_patch_response.status_code == 404
    assert second_user_delete_response.status_code == 404

    owner_get_response = client.get(
        f"/api/applications/{application_id}",
        headers=auth_headers,
    )
    assert owner_get_response.status_code == 200
    assert owner_get_response.json()["status"] == "applied"
