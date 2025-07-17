# configures flaks , database, resources
from flask import Flask 
from flask_sqlalchemy import SQLAlchemy 
from flask_migrate import Migrate 
from flask_cors import CORS 
from flask_restful import Api
from flask_jwt_extended import JWTManager

from routes.booking_route import booking_bp
# import booking management logic(user bookings,canceling,etc)
from routes.auth_route import registration_bp, login_bp

# JWT Config
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///minibus.db'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

api = Api(app)
jwt = JWTManager(app)

# register blueprints eg(app.register_blueprint(auth_bp, url_prefix='/auth'))
#Instead of writing all routes in app.py, we group related routes in separate files 
#(e.g., auth.py, bookings.py), and then register them in app.py using Blueprint.

app.register_blueprint(booking_bp, url_prefix="/bookings")
app.register_blueprint(registration_bp, url_prefix="/register")
app.register_blueprint(login_bp, url_prefix="/login")

# This is where you tell Flask to include those route groups into the main app.
# blueprint is booking_bp the example final route are (/bookings, bookings/1)
# so flask knows when I see a request atarting with /auth , go use the auth_bp

