import pytest
import uuid
from flask import Flask
from flask.testing import FlaskClient
from graphEndpoints import app
from unittest.mock import patch

LOGINDATEN=('3fa82f64-5717-4562-b3fc-2c900006afa6')

@pytest.fixture
def mock_getUserUUID():
    with patch('Endpoints_util.getUserUUID') as mock:
        yield mock

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client

def test_get_graph_algo(client, mock_getUserUUID):
        # Mocken die Rückgabewert der getUserUUID-Funktion
        mock_getUserUUID.return_value = LOGINDATEN

        response = client.get("/graph/algo")
        assert response.status_code == 200
        assert isinstance(response.json, list)

def test_get_graph_favorite(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.get("/graph/favorite/")
        assert response.status_code == 401

        # Mockt die Rückgabewert der getUserUUID-Funktion für random User
        mock_getUserUUID.return_value = str(uuid.uuid4())
        response = client.get("/graph/favorite/")
        assert response.status_code == 200
        assert len(response.json) == 0  # Keine Favoriten
        assert isinstance(response.json, list)

        # Mockt die Rückgabewert der getUserUUID-Funktion für Test User
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.get("/graph/favorite/")
        assert response.status_code == 200
        assert isinstance(response.json, list)

def test_post_graph_favorite(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.post("/graph/favorite/")
        assert response.status_code == 401

        # Mockt die Rückgabewert der getUserUUID-Funktion für Test User
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.post("/graph/favorite/",data= {"id": "123", "name": "test", "data": "test"})
        assert response.status_code == 409

        response = client.post("/graph/favorite/", data = {"id": str(uuid.uuid4()), "name": "favorite", "data": "e7877cd5-ccfd-4525-a563-d9bb793074e6", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})
        assert response.status_code == 200