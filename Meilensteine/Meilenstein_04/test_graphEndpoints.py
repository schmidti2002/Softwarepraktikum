import pytest
import uuid
from flask import Flask
from flask.testing import FlaskClient
from graphEndpoints import app
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

        # Nicht existierende Daten übergeben
        response = client.post("/graph/favorite/", data = {"id": str(uuid.uuid4()), "name": "favorite", "data": "e7877cd5-ccfd-4525-a563-d9bb793064e6", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})
        assert response.status_code == 409

        # Korrekte Anfrage
        response = client.post("/graph/favorite/", data = {"id": str(uuid.uuid4()), "name": "favorite", "data": "e7877cd5-ccfd-4525-a563-d9bb793074e6", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})
        assert response.status_code == 200

def test_delete_graph_favorite(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.delete("/graph/favorite/123")
        assert response.status_code == 401
        
        # Mockt die Rückgabewert der getUserUUID-Funktion für Test User
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.delete("/graph/favorite/b2691d80-e4eb-4434-965e-6ad067509191")
        assert response.status_code == 404
        assert b'favorite not found' in response.data
        
        # Erstellen eines Favoriten
        favorite_uuid = str(uuid.uuid4())
        response = client.post("/graph/favorite/", data = {"id": favorite_uuid, "name": "löschen", "data": "e7877cd5-ccfd-4525-a563-d9bb793074e6", "state": "4e65d197-d0d6-11ee-a5bb-d03957a7be94"})


        # Anfrage ohne Rechte
        mock_getUserUUID.return_value = "3fa82f64-5717-4562-b3fc-2c911116afa6"
        response = client.delete("/graph/favorite/"+favorite_uuid)
        assert response.status_code == 403

        # Anfrage mit Rechten
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.delete("/graph/favorite/"+favorite_uuid)
        assert response.status_code == 200

def test_get_graph_data(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.get("/graph/data")
        assert response.status_code == 401

        # Mockt die Rückgabewert der getUserUUID-Funktion für random User
        mock_getUserUUID.return_value = str(uuid.uuid4())
        response = client.get("/graph/data")
        assert response.status_code == 200
        assert len(response.json) == 0  # Keine Graphen
        assert isinstance(response.json, list)

        # Mockt die Rückgabewert der getUserUUID-Funktion für Test User
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.get("/graph/data")
        assert response.status_code == 200
        assert isinstance(response.json, list)

def test_post_graph_data(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.post("/graph/data")
        assert response.status_code == 401

        # Mockt die Rückgabewert der getUserUUID-Funktion für Test User
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.post("/graph/data", data = {"id": str(uuid.uuid4())})
        assert response.status_code == 409
        assert b'Send data conflicts with existing entry' in response.data

        # Korrekte Anfrage
        """Das Muss leider noch überarbeite werden, da die Datenstruktur nicht stimmt."""
        uuid_node1 = str(uuid.uuid4())
        uuid_node2 = str(uuid.uuid4())
        nodes = [{"id":uuid_node1,"value":"41"},{"id":uuid_node2,"value":"42"}]
        edges = [{"from":uuid_node1,"to":uuid_node2},{"from":uuid_node1,"to":uuid_node1},{"from":uuid_node2,"to":uuid_node2}]
        data = {"id": str(uuid.uuid4()), "nodes": nodes, "edges": edges}
        response = client.post("/graph/data", data = data)
        assert response.status_code == 409

def test_get_graph_data_id(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.get("/graph/data/123")
        assert response.status_code == 401

        # Teste auf einen nicht existierenden Graphen
        mock_getUserUUID.return_value = str(uuid.uuid4())
        response = client.get("/graph/data/e7877cd5-ccfd-4525-a563-d935793074e6")
        assert response.status_code == 404
        assert b'graph not found' in response.data

        # Teste auf vorhandenen Graphen
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.get("/graph/data/e7877cd5-ccfd-4525-a563-d9bb793074e6")
        assert response.status_code == 200
        assert isinstance(response.json, dict)

