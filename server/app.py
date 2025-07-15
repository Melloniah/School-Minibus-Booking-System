from flask import Flask 
from models import db 
# we will import from routes

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://minibus.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False

    db.init_app(app)

    # we will add our routes here

