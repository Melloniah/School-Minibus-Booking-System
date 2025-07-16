# configures flaks , database, resources
from flask import Flask 
from flask_sqlalchemy import SQLALchemy 
from flask_migrate import Migrate 
from flask_cors import CORS 
from flask_restful import Api

# we will import from routes eg(from routes.auth import auth_bp)

from routes.booking_route import booking_bp
# import booking management logic(user bookings,canceling,etc)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://minibus.db'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False

db = SQLALchemy(app)
migrate = Migrate(app, db)
CORS(app)
api = Api(app)

# register blueprints eg(app.register_blueprint(auth_bp, url_prefix='/auth'))
#Instead of writing all routes in app.py, we group related routes in separate files 
#(e.g., auth.py, bookings.py), and then register them in app.py using Blueprint.

app.register_blueprint(booking_bp, url_prefix="/bookings")
# This is where you tell Flask to include those route groups into the main app.
# blueprint is booking_bp the example final route are (/bookings, bookings/1)
# so falsk knows when I see a request atarting with /auth , go use the auth_bp

