import pytest
import uuid
from flask import Flask
from flask.testing import FlaskClient
from Backend.listEndpoints import app
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

def test_get_list_algo(client, mock_getUserUUID):
        # Anmeldung ohne API-Key
        mock_getUserUUID.return_value = None
        response = client.get("/list/algo")
        assert response.status_code == 401

        # Mocken die Rückgabewert der getUserUUID-Funktion
        mock_getUserUUID.return_value = LOGINDATEN

        response = client.get("/list/algo")
        assert response.status_code == 200
        assert isinstance(response.json, list)	

def test_get_list_favorite(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.get("/list/favorite")
        assert response.status_code == 401

        # Mockt die Rückgabewert der getUserUUID-Funktion für random User
        mock_getUserUUID.return_value = str(uuid.uuid4())
        response = client.get("/list/favorite")
        assert response.status_code == 200
        assert len(response.json) == 0  # Keine Favoriten
        assert isinstance(response.json, list)

        # Mockt die Rückgabewert der getUserUUID-Funktion für Test User
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.get("/list/favorite")
        assert response.status_code == 200
        assert isinstance(response.json, list)

def test_post_list_favorite(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.post("/list/favorite")
        assert response.status_code == 401

        # Fehlerhafter Request
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.post("/list/favorite",data= {"id": str(uuid.uuid4()),  "data": "f9160c5b-9b7c-4b35-8c1c-14c2695ca11a", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})	
        assert response.status_code == 409

        # Korrekte Anfrage
        test_list_uuid = str(uuid.uuid4())
        response = client.post("/list/favorite",data= {"id": test_list_uuid, "name": "test", "data": "f9160c5b-9b7c-4b35-8c1c-14c2695ca11a", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})	
        assert response.status_code == 200

        # Duppele Anfrage
        response = client.post("/list/favorite",data= {"id": test_list_uuid, "name": "test", "data": "f9160c5b-9b7c-4b35-8c1c-14c2695ca11a", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})	
        assert response.status_code == 409

def test_delete_list_favorite(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.delete("/list/favorite/123")
        assert response.status_code == 401

        # Test mit angemeldetem User aber falscher ID
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.delete("/list/favorite/"+str(uuid.uuid4()))
        assert response.status_code == 404
        assert b'favorite not found' in response.data
        
        # Erstellen eines Favoriten
        favorite_uuid = str(uuid.uuid4())
        response = client.post("/list/favorite", data = {"id": favorite_uuid, "name": "löschen", "data": "f9160c5b-9b7c-4b35-8c1c-14c2695ca11a", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})
        assert response.status_code == 200

        # Anfrage ohne Rechte
        mock_getUserUUID.return_value = "3fa82f64-5717-4562-b3fc-2c911116afa6"
        response = client.delete("/list/favorite/"+favorite_uuid)
        assert response.status_code == 403

        # Anfrage mit Rechten
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.delete("/list/favorite/"+favorite_uuid)
        assert response.status_code == 200

def test_get_list_data(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.get("/list/data")
        assert response.status_code == 401

        # Mockt die Rückgabewert der getUserUUID-Funktion für random User
        mock_getUserUUID.return_value = str(uuid.uuid4())
        response = client.get("/list/data")
        assert response.status_code == 200
        assert len(response.json) == 0  # Keine Listen
        assert isinstance(response.json, list)

        # Mockt die Rückgabewert der getUserUUID-Funktion für Test User
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.get("/list/data")
        assert response.status_code == 200
        assert isinstance(response.json, list)

def test_post_list_data(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.post("/list/data")
        assert response.status_code == 401

        # Test fehlerhafter Request
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.post("/list/data", data = {"id": str(uuid.uuid4())})
        assert response.status_code == 409
        assert b'Send data conflicts with existing entry' in response.data

        # Korrekte Anfrage
        """Die Übergabe von Listen gibt Probleme beim request"""
        test_list_data_uuid = str(uuid.uuid4())
        values = ["1", "2", "3", "4", "5"]
        data = json.dumps({"id": test_list_data_uuid, "values": values})
        response = client.post("/list/data", json = data)
        assert response.status_code == 200

        # Test auf doppelte Anfrage
        response = client.post("/list/data", json = data)
        assert response.status_code == 409
        assert b'Send data conflicts with existing entry' in response.data

def test_get_list_data_id(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.get("/list/data/123")
        assert response.status_code == 401

        # Teste auf einen nicht existierenden Graphen
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.get("/list/data/f9160c5b-9b7c-4b35-8c1c-14c2695ca444")
        assert response.status_code == 404
        assert b'list not found' in response.data

        # Teste auf vorhandenen Graphen
        response = client.get("/list/data/f9160c5b-9b7c-4b35-8c1c-14c2695ca11a")
        assert response.status_code == 200
        assert isinstance(response.json, dict)
