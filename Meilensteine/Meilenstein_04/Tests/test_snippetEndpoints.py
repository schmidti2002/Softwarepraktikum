import pytest
import uuid
from flask import Flask
from flask.testing import FlaskClient
from Backend.snippetEndpoints import app
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

def test_get(client, mock_getUserUUID):
    # Test nicht angemeldet
    mock_getUserUUID.return_value = None
    response = client.get("/snippet/123")
    assert response.status_code == 401

    # Mock der Anmeldung
    mock_getUserUUID.return_value = LOGINDATEN

    # Test von zufälligem Snippet
    response = client.get("/snippet/"+str(uuid.uuid4()))
    assert response.status_code == 404

    # Test vergebener Key
    response = client.get("/snippet/d300c83b-d0d0-11ee-9232-d03957a7be94")
    assert response.status_code == 200
    assert isinstance(response.json, dict)