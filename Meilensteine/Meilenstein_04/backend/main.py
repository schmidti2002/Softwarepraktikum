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
import userEndpoints as userEndpoints
import listEndpoints as listEndpoints
import graphEndpoints as graphEndpoints
import sortEndpoints as sortEndpoints
import codestateEndpoints as codestateEndpoints
import HistoryEndpoints as historyEndpoints
import snippetEndpoints as snippetEndpoints
import easteregg as easteregg

app = Flask(__name__)
api = Api(app)

database = None
cursor = None
api.add_resource(codestateEndpoints.code_state, "/code-state")
api.add_resource(codestateEndpoints.code_state_id, "/code-state/<string:stateId>")

api.add_resource(userEndpoints.user, '/user')
api.add_resource(userEndpoints.user_edit, '/user-edit/<string:edituserid>')
api.add_resource(userEndpoints.users, '/users')
api.add_resource(userEndpoints.userapitoken,'/user/apitoken')
api.add_resource(userEndpoints.userpassword_reset, '/user/reset-password')
api.add_resource(userEndpoints.userpassword_reset_username, '/user/reset-password/<string:username>')

api.add_resource(sortEndpoints.sort_algo, "/sort/algo")
api.add_resource(sortEndpoints.sort_favorite, "/sort/favorite")
api.add_resource(sortEndpoints.sort_favorite_id, "/sort/favorite/<string:favorite_id>")
api.add_resource(sortEndpoints.sort_data, "/sort/data")
api.add_resource(sortEndpoints.sort_data_id, "/sort/data/<string:sort_id>")

api.add_resource(snippetEndpoints.snippet, "/snippet/<string:snippetId>")

api.add_resource(listEndpoints.list_algo, "/list/algo")
api.add_resource(listEndpoints.list_favorite, "/list/favorite")
api.add_resource(listEndpoints.list_favorite_id, "/list/favorite/<string:favorite_id>")
api.add_resource(listEndpoints.list_data, "/list/data")
api.add_resource(listEndpoints.list_data_id, "/list/data/<string:list_id>")

api.add_resource(historyEndpoints.history, "/history/<string:type>")

api.add_resource(graphEndpoints.graph_algo, '/graph/algo')
api.add_resource(graphEndpoints.graph_favorite, '/graph/favorite/')
api.add_resource(graphEndpoints.graph_favorite_favorite_id, '/graph/favorite/<favorite_id>')
api.add_resource(graphEndpoints.graph_data, '/graph/data')
api.add_resource(graphEndpoints.graph_data_id, '/graph/data/<graph_id>')

api.add_resource(easteregg.brew_coffee, '/brew_coffee')

#Endpunkt falls kein Endpunkt gefunden wird
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return (f"Bitte einen richtigen Endpunkt treffen. Angeforderter Pfad: /{path}", 400)

# Aufbau der Datenbankverbindung zum Start und INIT
with app.app_context():
    database = Endpoints_util.db_connect()
    cursor = database.cursor()


if __name__ == "__main__":
    database = Endpoints_util.db_connect()
    cursor = database.cursor()
    app.run()
