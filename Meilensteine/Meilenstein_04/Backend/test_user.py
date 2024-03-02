import pytest
import uuid
from flask import Flask
from flask.testing import FlaskClient
from userEndpoints import app

LOGINDATEN=('Florian', 'florian')

def login(client: FlaskClient):
    response = client.post('/user/apitoken',auth=LOGINDATEN)
    assert response.status_code == 200
    return client

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client

def test_login(client):
    response = client.post('/user/apitoken', auth=('test_user','test_password'))
    assert response.status_code == 401
    response = client.post('/user/apitoken', auth=('Florian', 'vebfhvdbah'))
    assert response.status_code == 401
    response = client.post('/user/apitoken', auth=('Florian', 'florian'))
    assert response.status_code == 200
    assert b'login successfull' == response.data

def test_apitoken(client):
    response = client.get('/user/apitoken')
    assert response.status_code == 401

    login(client)
    response = client.get('/user/apitoken')
    assert response.status_code == 200

def test_user_creation(client):
    # Anmelden und API-Key generieren
    # client = login(client)
    login(client)
    #Fehlerhafte Übermittlung der Daten
    data = dict(username='new_user', passwd='new_password')
    response = client.post('/user', data=data)
    assert response.status_code == 409
    #Fehlerhfte Anfragen an die Datenbank
    data = dict(id="uuid.uuid4()", username='new_user', passwd='new_password', email='new_user@example.com', admin=False)
    response = client.post('/user', data=data)
    assert response.status_code == 409
    #User erstellen
    data = dict(id=uuid.uuid4(), username='new_user', passwd='new_password', email='new_user@example.com', admin=False)
    response = client.post('/user', data=data)
    assert response.status_code == 200
    assert b'user successfully created' in response.data

def test_user_update(client):
    # Anmelden und API-Key generieren
    login(client)

    #Fehlerhafte Übermittlung der Daten
    data = dict(username='updated_user', passwd='updated_password', email='updated_user@example.com', admin=False)
    response = client.put('/user', data=data)
    assert response.status_code == 409
    #User nicht gefunden
    data = dict(id=uuid.uuid4(), username='updated_user', passwd='updated_password', email='updated_user@example.com', admin=False)
    response = client.put('/user', data=data)
    assert response.status_code == 404
    #User updaten
    #user erstellen der geupdatet werden soll
    userid = uuid.uuid4()
    data = dict(id=userid, username='new_user', passwd='new_password',email="updated_user@example.com", admin=False)
    response = client.post('/user', data=data)
    assert response.status_code == 200
    #user updaten
    data = dict(id=userid, username='updated_user', passwd='updated_password', email='updated_user@example.com', admin=False)
    response = client.put('/user', data=data)
    assert response.status_code == 200
    assert b'User got updated' in response.data

def test_user_deletion(client):
    # Anmelden und API-Key generieren
    login(client)

    #Tests
    response = client.delete(f'/user_edit/{uuid.uuid4()}')
    assert response.status_code == 404
    assert b'User not found' in response.data

    #user erstellen der gelöscht werden soll
    userid = uuid.uuid4()
    data = dict(id=userid, username='new_user', passwd='new_password', email='new_user@example.com', admin=False)
    response = client.post('/user', data=data)
    assert response.status_code == 200
    #user löschen
    response = client.delete(f'/user_edit/{userid}')
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
    response = client.delete('/user/apitoken')
    assert response.status_code == 200
    assert b'apitoken delted' in response.data
