import pytest
import uuid
from datetime import datetime, timedelta
from unittest.mock import Mock
from Backend.Endpoints_util import getUserUUID, verify_admin

def test_check_api_key_valid():
    # Mocking request object with valid API key
    mock_request = Mock()
    mock_request.cookies.get.return_value = "valid_api_key"

    # Mocking database cursor
    DESIRED_FORMAT = "%Y-%m-%d %H:%M:%S+00:00"
    timestamp = datetime.now().strftime(DESIRED_FORMAT)
    mock_cursor = Mock()
    user_uuid = uuid.uuid4()
    mock_cursor.fetchone.return_value = (user_uuid, timestamp)

    # Mocking database connection
    mock_database = Mock()
    mock_database.cursor.return_value = mock_cursor

    # Testing with valid API key
    result = getUserUUID(mock_request, mock_database)
    assert result == user_uuid


def test_check_api_key_invalid():
    # Mocking request object with valid API key
    mock_request = Mock()
    mock_request.cookies.get.return_value = "valid_api_key"

    # Mocking database cursor
    DESIRED_FORMAT = "%Y-%m-%d %H:%M:%S+00:00"
    timestamp = (datetime.now() - timedelta(minutes=30)).strftime(DESIRED_FORMAT)
    mock_cursor = Mock()
    user_uuid = uuid.uuid4()
    mock_cursor.fetchone.return_value = (user_uuid, timestamp)

    # Mocking database connection
    mock_database = Mock()
    mock_database.cursor.return_value = mock_cursor

    # Testing with invalid API key
    with pytest.raises(Exception) as e_info:
        getUserUUID(mock_request, mock_database)

    assert e_info.value.code == 401

def test_verify_admin():
    # Mocking database cursor
    mock_cursor = Mock()
    mock_cursor.fetchone.return_value = (True,)

    # Mocking database connection
    mock_database = Mock()
    mock_database.cursor.return_value = mock_cursor

    # Testing with admin user
    result = verify_admin(1, mock_database)
    assert result == True

def test_verify_non_admin():
    # Mocking database cursor
    mock_cursor = Mock()
    mock_cursor.fetchone.return_value = (False,)

    # Mocking database connection
    mock_database = Mock()
    mock_database.cursor.return_value = mock_cursor

    # Testing with non-admin user
    with pytest.raises(Exception) as e_info:
        verify_admin(1, mock_database)

    assert e_info.value.code == 403
