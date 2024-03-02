import pytest
from Backend.easteregg import app 

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client

def test_esteregg(client):
    response = client.get('/brew_coffee')
    assert response.status_code == 418
    assert b'Coffee is brewing' in response.data
