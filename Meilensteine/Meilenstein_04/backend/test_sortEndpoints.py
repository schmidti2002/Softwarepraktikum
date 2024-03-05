import pytest
import uuid
from flask import Flask
from flask.testing import FlaskClient
from sortEndpoints import app
from unittest.mock import patch

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

def test_get_sort_algo(client, mock_getUserUUID):
        # nicht angemeldeter User
        mock_getUserUUID.return_value = None
        response = client.get("/sort/algo")
        assert response.status_code == 401

        # Mocken die Rückgabewert der getUserUUID-Funktion
        mock_getUserUUID.return_value = LOGINDATEN

        response = client.get("/sort/algo")
        assert response.status_code == 200
        assert isinstance(response.json, list)

def test_get_sort_favorite(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.get("/sort/favorite")
        assert response.status_code == 401

        # Mockt die Rückgabewert der getUserUUID-Funktion für random User
        mock_getUserUUID.return_value = str(uuid.uuid4())
        response = client.get("/sort/favorite")
        assert response.status_code == 200
        assert len(response.json) == 0  # Keine Favoriten
        assert isinstance(response.json, list)

        # Mockt die Rückgabewert der getUserUUID-Funktion für Test User
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.get("/sort/favorite")
        assert response.status_code == 200
        assert isinstance(response.json, list)

def test_post_sort_favorite(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.post("/sort/favorite")
        assert response.status_code == 401

        # Fehlerhafter Request
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.post("/sort/favorite",data= {"id": str(uuid.uuid4()),  "data": "f9160c5b-9b7c-4b35-8c1c-14c2695ca11a", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})	
        assert response.status_code == 409

        # Korrekte Anfrage
        test_sort_uuid = str(uuid.uuid4())
        response = client.post("/sort/favorite",data= {"id": test_sort_uuid, "name": "test", "data": "4fb16b25-d0d3-11ee-adcb-d03957a7be94", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})	
        assert response.status_code == 200

        # Duppele Anfrage
        response = client.post("/sort/favorite",data= {"id": test_sort_uuid, "name": "test", "data": "4fb16b25-d0d3-11ee-adcb-d03957a7be94", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})	
        assert response.status_code == 409

def test_delete_sort_favorite(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.delete("/sort/favorite/123")
        assert response.status_code == 401

        # Test mit angemeldetem User aber falscher ID
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.delete("/sort/favorite/"+str(uuid.uuid4()))
        assert response.status_code == 404
        assert b'favorite not found' in response.data
        
        # Erstellen eines Favoriten
        favorite_uuid = str(uuid.uuid4())
        response = client.post("/sort/favorite", data = {"id": favorite_uuid, "name": "löschen", "data": "4fb16b25-d0d3-11ee-adcb-d03957a7be94", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})
        assert response.status_code == 200

        # Anfrage ohne Rechte
        mock_getUserUUID.return_value = str(uuid.uuid4())
        response = client.delete("/sort/favorite/"+favorite_uuid)
        assert response.status_code == 403

        # Anfrage mit Rechten
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.delete("/sort/favorite/"+favorite_uuid)
        assert response.status_code == 200

def test_get_sort_data(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.get("/sort/data")
        assert response.status_code == 401

        # Mockt die Rückgabewert der getUserUUID-Funktion für random User
        mock_getUserUUID.return_value = str(uuid.uuid4())
        response = client.get("/sort/data")
        assert response.status_code == 200
        assert len(response.json) == 0  # Keine Listen
        assert isinstance(response.json, list)

        # Mockt die Rückgabewert der getUserUUID-Funktion für Test User
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.get("/sort/data")
        assert response.status_code == 200
        assert isinstance(response.json, list)  
    
def test_post_sort_data(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.post("/sort/data")
        assert response.status_code == 401

        # Fehlerhafter Request
        """Überarbeiten des Befehls wegen übergabe von Listen"""
        mock_getUserUUID.return_value = LOGINDATEN
        data= {"id": str(uuid.uuid4())}
        response = client.post("/sort/data",json= data)
        assert response.status_code == 409

        # Korrekte Anfrage
        test_sort_data_uuid = str(uuid.uuid4())
        values = ["1", "2", "3", "4", "5"]
        type = "Testtyp"
        data = json.dumps({"id": test_sort_data_uuid, "values": values, "type": type})
        response = client.post("/sort/data", json = data)
        assert response.status_code == 200

        # Test auf doppelte Anfrage
        response = client.post("/sort/data", json = data)
        assert response.status_code == 409
        assert b'Send data conflicts with existing entry' in response.data

def test_get_sort_data_id(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.get("/sort/data/123")
        assert response.status_code == 401

        # Teste auf einen nicht existierenden Graphen
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.get("/sort/data/"+str(uuid.uuid4()))
        assert response.status_code == 404
        assert b'sort not found' in response.data

        # Teste auf vorhandenen Graphen
        response = client.get("/sort/data/4fb16b25-d0d3-11ee-adcb-d03957a7be94")
        assert response.status_code == 200
        assert isinstance(response.json, dict)