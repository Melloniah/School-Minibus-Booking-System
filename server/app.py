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
from routes.pickup_dropoff_route import pickup_dropoff_bp
# import booking management logic(user bookings,canceling,etc)
import os 
from datetime import timedelta
from dotenv import load_dotenv
load_dotenv()
import subprocess

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

# to run migrations always in render
def run_migrations():
    try:
        print("📦 Running Alembic migrations...")
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        print("✅ Alembic migrations applied.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Alembic migration failed: {e}")

run_migrations()


# Database
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///minibus.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Config
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')  # Required
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_COOKIE_SECURE'] = os.environ.get('JWT_COOKIE_SECURE', 'True').lower() == 'true'
app.config['JWT_COOKIE_SAMESITE'] = os.environ.get('JWT_COOKIE_SAMESITE', 'Lax')
app.config['JWT_COOKIE_CSRF_PROTECT'] = os.environ.get('JWT_COOKIE_CSRF_PROTECT', 'True').lower() == 'true'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=int(os.environ.get('JWT_EXPIRATION_HOURS', 1)))


db.init_app(app) 
migrate = Migrate(app, db)

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")  # fallback to localhost

CORS(app, 
     supports_credentials=True,
     origins=[frontend_origin],
     expose_headers=["Content-Type", "Authorization"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)


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

