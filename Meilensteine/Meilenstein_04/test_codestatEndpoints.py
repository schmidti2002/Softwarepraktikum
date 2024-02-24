import pytest
import uuid
from flask import Flask
from flask.testing import FlaskClient
from listEndpoints import app
from unittest.mock import patch
import psycopg2

import json

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

def test_post(client, mock_getUserUUID):
    # Test nicht angemeldet
    mock_getUserUUID.return_value = None
    response = client.post()
    assert response.status_code == 401

    # Mock der Anmeldung
    mock_getUserUUID = LOGINDATEN

    response = client.post()
    assert response.status_code == 200

def test_get (client, mock_getUserUUID):
    # Test nicht angemeldet
    mock_getUserUUID.return_value = None
    response = client.get("/code-state/" + LOGINDATEN)
    assert response.status_code == 401

    # Mock der Anmeldung
    mock_getUserUUID = LOGINDATEN

    response = client.get("/code-state/" + LOGINDATEN)
    assert response.status_code == 200

def test_delete (client, mock_getUserUUID):
    # Test nicht angemeldet
    mock_getUserUUID.return_value = None
    response = client.delete("/code-state/" + LOGINDATEN)
    assert response.status_code == 401

    # Mock der Anmeldung
    mock_getUserUUID = LOGINDATEN

    response = client.delete("/code-state/")
    assert response.status_code == 404

    response = client.delete("/code-state/" + LOGINDATEN)
    assert response.status_code == 200