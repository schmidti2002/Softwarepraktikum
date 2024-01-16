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
        apikey = Endpoints_util.verifyapikey(request, database)
        
