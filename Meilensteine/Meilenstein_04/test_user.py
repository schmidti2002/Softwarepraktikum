import pytest
import uuid
from flask import Flask
from flask.testing import FlaskClient
from userEndpoints import app

LOGINDATEN={'username':'Florian', 'password':'florian'}

def login(client: FlaskClient):
    response = client.get('/login', data=dict(username=LOGINDATEN['username'], password=LOGINDATEN['password']))
    assert response.status_code == 200
    return client

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client

def test_login(client):
    response = client.get('/login', data=dict(username='test_user', password='test_password'))
    assert response.status_code == 401
    response = client.get('/login', data=dict(username='Florian', password='florian'))
    assert response.status_code == 200
    assert b'login successfull' == response.data

def test_user_creation(client):
    # Anmelden und API-Key generieren
    # client = login(client)
    response = client.get('/login', data=dict(username=LOGINDATEN['username'], password=LOGINDATEN['password']))
    assert response.status_code == 200

    #Tests
    data = dict(id=uuid.uuid4(), username='new_user', passwd='new_password', email='new_user@example.com', admin=True)
    response = client.post('/user', data=data)
    assert response.status_code == 200
    assert b'user successfully created' in response.data

def test_user_update(client):
    # Anmelden und API-Key generieren
    login(client)

    #Tests
    data = dict(id=uuid.uuid4(), username='updated_user', passwd='updated_password', email='updated_user@example.com', admin=False)
    response = client.put('/user', data=data)
    assert response.status_code == 200
    assert b'User got updated' in response.data

def test_user_deletion(client):
    # Anmelden und API-Key generieren
    login(client)

    #Tests
    response = client.delete(f'/user_edit/{uuid.uuid4()}')
    assert response.status_code == 200
    assert b'user got deleted' in response.data

def test_get_user(client):
    # Anmelden und API-Key generieren
    login(client)

    #Tests
    response = client.get('/user')
    assert response.status_code == 200
    assert b'id' in response.data
    assert b'username' in response.data
    assert b'admin' in response.data
    assert b'email' in response.data

def test_get_users(client):
    # Anmelden und API-Key generieren
    client = login(client)

    #Tests
    response = client.get('/useres')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_logout(client):
    # Anmelden und API-Key generieren
    client = login(client)
    # Simulieren einer vorherigen erfolgreichen Anmeldung
    response = client.get('/logout')
    assert response.status_code == 200
    assert b'logout successfull' in response.data
