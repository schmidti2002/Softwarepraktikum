# alle
from flask_restful import Resource, Api
from flask import Flask, jsonify
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
api = Api(app)
csrf = CSRFProtect(app)

class brew_coffee(Resource):
    def get(self):
        return ("Coffee is brewing", 418)

api.add_resource(brew_coffee, '/brew_coffee')
