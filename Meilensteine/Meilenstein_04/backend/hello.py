from flask import Flask

app = Flask(__name__)


@app.route('/user/login')
def hello():
    return 'Everyone is logged in!'