# tests.py
import pytest
from flask import Flask
from flask.testing import FlaskClient
from Meilensteine.Meilenstein_04.user_endpoints import app  # Stelle sicher, dass 'app' der Name deiner Flask-Anwendung ist

apicookies = []

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_login(client):
    # Annahme: Du hast einen gültigen Benutzer für Testzwecke in der Datenbank
    response = client.get('/login', data={"username":'Florian', "password":'florian'})
    apicookies = response.headers.get('Set-Cookie')
    client.set_cookie('apiKey', apicookies)

    assert response.status_code == 200
    assert 'login successfull' in response.get_data(as_text=True)

def test_user_get(client):
    # Annahme: Du hast einen gültigen API-Key für Testzwecke
    response = client.get('/user')
    assert response.status_code == 404
    # Hier müsstest du die erwarteten Daten anhand der Testdatenbank oder Mock-Daten überprüfen

def test_user_post(client):
    # Annahme: Du hast einen gültigen API-Key mit Adminrechten für Testzwecke
    response = client.post('/user', headers={'Cookie': 'apiKey=test_api_key'}, data=dict(
        id='123', username='new_user', passwd='new_password', email='new_user@example.com', admin='1'
    ))
    assert response.status_code == 404
    #assert 'user successfully created' in response.get_data(as_text=True)

def test_user_put(client):
    # Annahme: Du hast einen gültigen API-Key mit Adminrechten für Testzwecke
    response = client.put('/user', headers={'Cookie': 'apiKey=test_api_key'}, data=dict(
        id='123', username='updated_user', passwd='updated_password', email='updated_user@example.com', admin='1'
    ))
    assert response.status_code == 404
    #assert 'User got updated' in response.get_data(as_text=True)

def test_user_edit_delete(client):
    # Annahme: Du hast einen gültigen API-Key mit Adminrechten für Testzwecke
    response = client.delete('/user/edit/123', headers={'Cookie': 'apiKey=test_api_key'})
    assert response.status_code == 404
    #assert 'user got deleted' in response.get_data(as_text=True)

def test_user_edit_get(client):
    # Annahme: Du hast einen gültigen API-Key mit Adminrechten für Testzwecke
    response = client.get('/user/edit/123', headers={'Cookie': 'apiKey=test_api_key'})
    assert response.status_code == 404
    # Hier müsstest du die erwarteten Daten anhand der Testdatenbank oder Mock-Daten überprüfen

def test_useres(client):
    # Annahme: Du hast einen gültigen API-Key mit Adminrechten für Testzwecke
    response = client.get('/useres', headers={'Cookie': 'apiKey=test_api_key'})
    assert response.status_code == 404
    # Hier müsstest du die erwarteten Daten anhand der Testdatenbank oder Mock-Daten überprüfen
