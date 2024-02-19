# alle
from flask_restful import Resource, Api
from flask import Flask, jsonify

app = Flask(__name__)
api = Api(app)
app.config['SECRET_KEY'] = "12456789"

class brew_coffee(Resource):
    def get(self):
        return ("Coffee is brewing", 418)

api.add_resource(brew_coffee, '/brew_coffee')
