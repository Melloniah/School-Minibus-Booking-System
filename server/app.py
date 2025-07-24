# configures flaks , database, resources
from flask import Flask 
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy 
from flask_migrate import Migrate 
from flask_cors import CORS 
from flask_restful import Api
from flask_jwt_extended import JWTManager
from routes.routes import route_bp
from routes.bus_routes import bus_bp
from models import db
from routes.auth_route import auth_bp #helps solve the CORS issue
from routes.pickup_dropoff_route import pickup_bp
from routes.booking_route import booking_bp
# import booking management logic(user bookings,canceling,etc)
import os 

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'minibus.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Config
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['JWT_TOKEN_LOCATION'] = ['headers','cookies']
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  
app.config['JWT_COOKIE_SECURE'] = False  # Allow cookies over HTTP (not HTTPS)
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'  # Or 'None' if cross-site requests with credentials are needed


db.init_app(app) 
migrate = Migrate(app, db)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

api = Api(app)
jwt = JWTManager(app)

# register blueprints eg(app.register_blueprint(auth_bp, url_prefix='/auth'))
#Instead of writing all routes in app.py, we group related routes in separate files 
#(e.g., auth.py, bookings.py), and then register them in app.py using Blueprint.

app.register_blueprint(booking_bp, url_prefix="/bookings")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(route_bp, url_prefix="/routes")
app.register_blueprint(bus_bp, url_prefix="/buses") 
app.register_blueprint(pickup_bp, url_prefix="/location")


# This is where you tell Flask to include those route groups into the main app.
# blueprint is booking_bp the example final route are (/bookings, bookings/1)
# so flask knows when I see a request starting with /auth , go use the auth_bp

