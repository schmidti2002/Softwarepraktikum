import pytest
import uuid
from flask import Flask
from flask.testing import FlaskClient
from HistoryEndpoints import app
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

def test_get_history(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.get("/history/sort")
        assert response.status_code == 401

        # Test mit angemeldetem User Sort
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.get("/history/sort")
        assert response.status_code == 200
        assert isinstance(response.json, list)

        # Test mit angemeldetem User List
        response = client.get("/history/list")
        assert response.status_code == 200
        assert isinstance(response.json, list)

        # Test mit angemeldetem User Graph
        response = client.get("/history/graph")
        assert response.status_code == 200
        assert isinstance(response.json, list)

        # Test mit angemeldetem User All
        response = client.get("/history/all")
        assert response.status_code == 200
        assert isinstance(response.json, list)

        # Test mit angemeldetem User All
        response = client.get("/history/all?limit=10")
        assert response.status_code == 200
        assert isinstance(response.json, list)

        # Test mit angemeldetem User All
        response = client.get("/history/all?offset=0&limit=10")
        assert response.status_code == 200
        assert isinstance(response.json, list)

        # Test mit angemeldetem User All
        response = client.get("/history/all?offset=0")
        assert response.status_code == 200
        assert isinstance(response.json, list)

        # Test falscher Typ
        response = client.get("/history/abc")
        assert response.status_code == 404
        assert b'Type not found' in response.data

def test_post_history(client, mock_getUserUUID):
        # Test mit nicht angemeldetem User
        mock_getUserUUID.return_value = None
        response = client.post("/history/sort")
        assert response.status_code == 401

        # Test mit angemeldetem User Sort
        mock_getUserUUID.return_value = LOGINDATEN
        response = client.post("/history/sort",data= {"id": str(uuid.uuid4()), "time": "2000-01-01 00:00:00+00", "data": "4fb16b25-d0d3-11ee-adcb-d03957a7be94", "algo":"5c0a9842-4351-4508-af66-c588a19e19e8"})
        assert response.status_code == 200

        # Test mit angemeldetem User List
        response = client.post("/history/list",data= {"id": str(uuid.uuid4()), "time": "2000-01-01 00:00:00+00", "data": "f9160c5b-9b7c-4b35-8c1c-14c2695ca11a", "algo":"8dc6ba3a-b028-4b25-808c-9fba4b0454c6"})
        assert response.status_code == 200

        # Test mit angemeldetem User Graph
        test_uuid = str(uuid.uuid4())
        response = client.post("/history/graph",data= {"id": test_uuid, "time": "2000-01-01 00:00:00+00", "data": "e7877cd5-ccfd-4525-a563-d9bb793074e6", "algo":"4bf9065a-d0d2-11ee-9ff2-d03957a7be94"})
        assert response.status_code == 200

        # Test doppelter Einträge
        response = client.post("/history/graph",data= {"id": test_uuid, "time": "2000-01-01 00:00:00+00", "data": "e7877cd5-ccfd-4525-a563-d9bb793074e6", "algo":"4bf9065a-d0d2-11ee-9ff2-d03957a7be94"})
        assert response.status_code == 409

        # Test falscher Typ
        response = client.post("/history/abc",data= {"id": test_uuid, "time": "2000-01-01 00:00:00+00", "data": "e7877cd5-ccfd-4525-a563-d9bb793074e6", "algo":"4bf9065a-d0d2-11ee-9ff2-d03957a7be94"})
        assert response.status_code == 404
        assert b'Type not found' in response.data

