from datetime import datetime
from flask_restful import Api, Resource, abort
import psycopg2


DESIRED_FORMAT = "%Y-%m-%d %H:%M:%S+00:00"
MAX_APIKEY_AGE_MIN = 20

def db_connect():
    import psycopg2
    host_url = "swp.dczlabs.xyz"
    port = "3131"
    user_name = "swpusr"
    password = "251f6100a8ff1dd2"
    Datenbank = "swp"
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
        util_cursor.close()
        if time_diff.total_seconds() >= MAX_APIKEY_AGE_MIN * 60:
            return abort(401, message="API key is missing or invalid")
        return result[0] # User-UUID zurückgeben
    except :
        return abort(401, message="API key is missing or invalid ")

def verify_admin(user_uuid, database):
    util_cursor = database.cursor()
    util_cursor.execute("""SELECT rights FROM public."User" WHERE id = %s;""", (user_uuid,))
    result = util_cursor.fetchone()
    util_cursor.close()
    if not result[0]:
        return abort(403, message="User not allowed to execute this operation")
    return True # Adminrechte zurückgeben