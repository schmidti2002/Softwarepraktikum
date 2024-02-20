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
        response = client.get("/graph/favorite/")
        assert response.status_code == 401

        # Mockt die Rückgabewert der getUserUUID-Funktion für random User
        mock_getUserUUID.return_value = uuid.uuid4()
        response = client.get("/graph/favorite")
        assert response.status_code == 200
        assert isinstance(response.json, list)

        # Mockt die Rückgabewert der getUserUUID-Funktion für Test User
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.get("/graph/favorite")
        assert response.status_code == 200
        assert isinstance(response.json, list)

