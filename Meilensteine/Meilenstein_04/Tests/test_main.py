# test_paths.py
import pytest
from Backend.main import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_endpoints(client):
    paths_to_test = [
        '/',
        '/code-state',
        '/code-state/some_state_id',
        '/user',
        '/user_edit/some_edit_userid',
        '/useres',
        '/user/apitoken',
        '/sort/algo',
        '/sort/favorite',
        '/sort/favorite/some_favorite_id',
        '/sort/data',
        '/sort/data/some_sort_id',
        '/snippet/some_snippet_id',
        '/list/algo',
        '/list/favorite',
        '/list/favorite/some_favorite_id',
        '/list/data',
        '/list/data/some_list_id',
        '/history/some_type',
        '/graph/algo',
        '/graph/favorite/',
        '/graph/favorite/some_favorite_id',
        '/graph/data',
        '/graph/data/some_graph_id',
        '/brew_coffee'
    ]

    for path in paths_to_test:
        response = client.get(path)
        assert response.status_code == 200  # Überprüfen, ob die Antwort erfolgreich ist
