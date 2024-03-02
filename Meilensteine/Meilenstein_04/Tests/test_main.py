import pytest
from Meilensteine.Meilenstein_04.Backend.main import api
@pytest.fixture
def mock_resources():
    # Erstellen von Mock-Objekten für die Ressourcen
    resources = {
        '/code-state': codestateEndpoints.code_state,
        '/code-state/<string:stateId>': codestateEndpoints.code_state_id,
        '/user': userEndpoints.user,
        '/user_edit/<edit_userid>': userEndpoints.user_edit,
        '/useres': userEndpoints.useres,
        '/user/apitoken': userEndpoints.userapitoken,
        '/sort/algo': sortEndpoints.sort_algo,
        '/sort/favorite': sortEndpoints.sort_favorite,
        '/sort/favorite/<string:favorite_id>': sortEndpoints.sort_favorite_id,
        '/sort/data': sortEndpoints.sort_data,
        '/sort/data/<string:sort_id>': sortEndpoints.sort_data_id,
        '/snippet/<string:snippetId>': snippetEndpoints.snippet,
        '/list/algo': listEndpoints.list_algo,
        '/list/favorite': listEndpoints.list_favorite,
        '/list/favorite/<string:favorite_id>': listEndpoints.list_favorite_id,
        '/list/data': listEndpoints.list_data,
        '/list/data/<string:list_id>': listEndpoints.list_data_id,
        '/history/<string:type>': historyEndpoints.history,
        '/graph/algo': graphEndpoints.graph_algo,
        '/graph/favorite/': graphEndpoints.graph_favorite,
        '/graph/favorite/<favorite_id>': graphEndpoints.graph_favorite_favorite_id,
        '/graph/data': graphEndpoints.graph_data,
        '/graph/data/<graph_id>': graphEndpoints.graph_data_id
    }
    return resources

def test_api_endpoints(mock_resources):
    # Iterieren über die Pfade und sicherstellen, dass die richtigen Ressourcen zugeordnet sind
    for path, resource in mock_resources.items():
        assert path in api.resources, f"Path {path} not found in API resources"
        assert api.resources[path] == resource, f"Resource mismatch for path {path}"
