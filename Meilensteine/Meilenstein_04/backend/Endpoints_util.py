from datetime import datetime
from flask_restful import Api, Resource, abort
import json
import psycopg2
import os

DESIRED_FORMAT = "%Y-%m-%d %H:%M:%S+00:00"
MAX_APIKEY_AGE_MIN = 20

def db_connect():
    import psycopg2
    host_url = os.environ.get('DB_HOST')
    port = os.environ.get('DB_PORT')
    user_name = os.environ.get('DB_USER')

    password_file_path = os.environ.get('DB_PASSWORD_FILE')
    Datenbank = os.environ.get('DB_NAME')

    # Das Passwort aus der geheimen Datei im Docker-Container lesen
    with open(password_file_path, 'r') as file:
        password = file.read().strip()
    database = psycopg2.connect(host=host_url, port= port, user=user_name, password=password, database=Datenbank)
    return database

def getUserUUID(request, database):
    # Daten aus dem Request holen und überprüfen
    try:
        apikey = request.cookies.get('apiKey')
        timestamp = datetime.now().strftime(DESIRED_FORMAT)
        util_cursor = database.cursor()
        util_cursor.execute("""SELECT "user", created FROM public."ApiKey" WHERE key = %s;""",(apikey,))
        result = util_cursor.fetchone()
        time_diff = datetime.strptime(timestamp, DESIRED_FORMAT) - datetime.strptime(str(result[1]), DESIRED_FORMAT)
        if time_diff.total_seconds() >= MAX_APIKEY_AGE_MIN * 60:
            return abort(401, message="API key is missing or invalid")
        
        # User-TimeStamp aktualisieren
        util_cursor.execute("""UPDATE public."ApiKey" SET created = %s WHERE "key" = %s;""", (timestamp, apikey))
        database.commit()
        util_cursor.close()
        return result[0] # User-UUID zurückgeben
    except :
        return abort(401, message="API key is missing or invalid ")

def verify_admin(user_uuid, database):
    try:
        util_cursor = database.cursor()
        util_cursor.execute("""SELECT rights FROM public."User" WHERE id = %s;""", (user_uuid,))
        result = util_cursor.fetchone()
        util_cursor.close()
        if not result[0]:
            return abort(403, message="User not allowed to execute this operation")
        return True # Adminrechte zurückgeben
    except:
        return abort(403, message="User not allowed to execute this operation")
    
def user_body(request):
    try:
        data_resquest= json.loads(request.get_json())
        id = data_resquest["id"]
        name =data_resquest["name"]
        data= data_resquest["data"]
        state =data_resquest["state"]
        if id == None or name == None or data == None or state == None:
            return ("Send data conflicts with existing entry", 409)
    except :
        return abort(409, message="Send data conflicts with existing entry")
    
    return {"id": id, "name": name, "data": data, "state": state}