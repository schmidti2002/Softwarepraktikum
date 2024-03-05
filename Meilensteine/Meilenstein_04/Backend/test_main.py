# test_paths.py
import pytest
from main import app
from unittest.mock import patch

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

LOGINDATEN=('3fa82f64-5717-4562-b3fc-2c900006afa6')

@pytest.fixture
def mock_getUserUUID():
    with patch('Endpoints_util.getUserUUID') as mock:
        yield mock

def test_endpoints(client, mock_getUserUUID):
    # Testen der Endpunkte
    mock_getUserUUID.return_value = LOGINDATEN

    paths_to_test = [
                    #("/code-state")
                    #("/code-state/"),
                    #('/user'),
                    #('/user_edit/'),
                    #('/useres'),
                    #('/user/apitoken'),
                    #("/sort/algo"),
                    #("/sort/favorite"),
                    #("/sort/favorite/"),
                    #("/sort/data"),
                    #("/sort/data/"),
                    #("/snippet/"),
                    #("/list/algo"),
                    #("/list/favorite"),
                    #("/list/favorite/"),
                    #("/list/data"),
                    #("/list/data/"),
                    #("/history/"),
                    #('/graph/algo'),
                    #('/graph/favorite/'),
                    #('/graph/favorite/'),
                    #('/graph/data'),
                    #('/graph/data/'),
                    ('/brew_coffee')
    ]
    
    status_codes = [200, 401, 403, 404, 409, 418]

    response = client.get('/dbrengfhdfgf')
    assert response.status_code == 400

    for path in paths_to_test:
        response = client.get(path)
        assert response.status_code in status_codes

