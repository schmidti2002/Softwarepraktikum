import pytest
import uuid
from flask import Flask
from flask.testing import FlaskClient
from codestatEndpoints import app
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
    response = client.post("/code-state")	
    assert response.status_code == 401

    # Mock der Anmeldung
    mock_getUserUUID.return_value = LOGINDATEN

    response = client.post("/code-state")
    assert response.status_code == 200

def test_get (client, mock_getUserUUID):
    # Test nicht angemeldet
    mock_getUserUUID.return_value = None
    response = client.get("/code-state/123" )
    assert response.status_code == 401

    # Mock der Anmeldung
    mock_getUserUUID.return_value = LOGINDATEN

    # Zufalls-ID
    response = client.get("/code-state/"+ str(uuid.uuid4()))
    assert response.status_code == 404

    # Valider Key
    response = client.get("/code-state/4e65d197-d0d6-11ee-a5bb-d03957a7be94")
    assert response.status_code == 200
    assert isinstance(response.json, dict)

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