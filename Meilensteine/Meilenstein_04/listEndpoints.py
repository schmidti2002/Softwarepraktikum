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
import Endpoints_util

app = Flask(__name__)
CORS(app)
api = Api(app)

database = Endpoints_util.db_connect()

class list_algo(Resource):
    def get(self):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        cursor = database.cursor()
        cursor.execute("""SELECT * FROM public."ListAlgo";""")
        result = cursor.fetchall()
        


class list_favorite(Resource):
    def get(self):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        pass

    def post(self):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        pass
        
