# alle
from typing import Any
from flask import Flask, request
from flask_restful import Api, Resource, abort
from flask_cors import CORS
import random
import string
from hashlib import sha256
import psycopg2
from flask import make_response, jsonify
from datetime import datetime
import Endpoints_util

# Import der Endpunkte
import Meilensteine.Meilenstein_04.Backend.userEndpoints as userEndpoints
import listEndpoints
import graphEndpoints
import sortEndpoints
import codestateEndpoints
import historyEndpoints
import snippetEndpoints
import easteregg 

app = Flask(__name__)
CORS(app)
api = Api(app)

database = None
cursor = None

if __name__ == "__main__":
    database = Endpoints_util.db_connect()
    cursor = database.cursor()
    app.run(debug=True)