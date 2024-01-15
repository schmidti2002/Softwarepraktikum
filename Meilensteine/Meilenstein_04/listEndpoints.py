# alle
from typing import Any
from flask import Flask, request
from flask_restful import Api, Resource, abort
from flask_cors import CORS
import random
import string

# wichtige 
from hashlib import sha256
import psycopg2
from flask import make_response, jsonify
from datetime import datetime

app = Flask(__name__)
CORS(app)
api = Api(app)

host_url = "swp.dczlabs.xyz"
port = "3131"
user_name = "swpusr"
password = "251f6100a8ff1dd2"
Datenbank = "swp"

database = psycopg2.connect(host=host_url,port=port, user=user_name,password=password,database=Datenbank)
cursor = database.cursor()
DESIRED_FORMAT = "%Y-%m-%d %H:%M:%S+00:00"
MAX_APIKEY_AGE_MIN = 20

def verifyapikey(request):
    # Daten aus dem Request holen und überprüfen
    try:
        apikey = request.cookies.get('apiKey')
        timestamp = datetime.now().strftime(DESIRED_FORMAT)

        cursor.execute("""SELECT "user", created FROM public."ApiKey" WHERE key = %s;""",(apikey,))
        result = cursor.fetchone()
        time_diff = datetime.strptime(timestamp, DESIRED_FORMAT) - datetime.strptime(str(result[1]), DESIRED_FORMAT)
        if result[0] == apikey and time_diff.total_seconds() <= MAX_APIKEY_AGE_MIN * 60:
            return abort(401, message="API key is missing or invalid")
        return apikey # API-Key zurückgeben
    except :
        return abort(401, message="API key is missing or invalid ")

def verifyapikey_admin(apikey):
    cursor.execute("""SELECT rights FROM public."User" JOIN public."ApiKey" on public."ApiKey"."user" = public."User"."id" WHERE key = %s;""", (apikey,))
    result = cursor.fetchone()
    if not result[0]:
        return abort(403, message="User not allowed to execute this operation")
    return True # Adminrechte zurückgeben
