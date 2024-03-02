import pytest
import uuid
from flask import Flask
from flask.testing import FlaskClient
from Meilensteine.Meilenstein_04.Backend.codestateEndpoints import app
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

    # Mock der Anmeldung und gültige Daten
    mock_getUserUUID.return_value = LOGINDATEN
    data = json.dumps({"id": str(uuid.uuid4()), "state": {"additionalProp1": {}}, "snippet": "d300c83b-d0d0-11ee-9232-d03957a7be94"})
    response = client.post("/code-state", json=data)
    assert response.status_code == 200

    # Doppelte Daten
    response = client.post("/code-state", json=data)
    assert response.status_code == 409

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
    response = client.delete("/code-state/123")
    assert response.status_code == 401

    # Mock der Anmeldung
    mock_getUserUUID.return_value = LOGINDATEN

    response = client.delete("/code-state/"+ str(uuid.uuid4()))
    assert response.status_code == 404

    #gültige Anfrage
    test_uuid = str(uuid.uuid4())
    data = json.dumps({"id": test_uuid, "state": {"additionalProp1": {}}, "snippet": "d300c83b-d0d0-11ee-9232-d03957a7be94"})
    response = client.post("/code-state", json=data)
    assert response.status_code == 200
    
    #Löschen ohne Rechte
    mock_getUserUUID.return_value = str(uuid.uuid4())
    response = client.delete("/code-state/" + test_uuid)
    assert response.status_code == 404
