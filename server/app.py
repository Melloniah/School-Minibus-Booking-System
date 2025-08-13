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
from routes.pickup_dropoff_route import pickup_bp
# import booking management logic(user bookings,canceling,etc)
import os 
from datetime import timedelta
from dotenv import load_dotenv
load_dotenv()
import subprocess
import logging



app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

# to run migrations always in render
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_migrations():
    try:
        logger.info("📦 Running Alembic migrations...")
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        logger.info("Alembic migrations applied.")
    except subprocess.CalledProcessError as e:
        logger.error(f"Alembic migration failed: {e}")



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

# this makes the vercel and render be connected and dynamic for localhost in development
def configure_cors(app):
    allowed_origins = [
        "http://localhost:3000",
        "https://school-minibus-booking-system.vercel.app"
    ]
    
    # Add environment-specific origin
    env_origin = os.getenv("FRONTEND_ORIGIN")
    if env_origin:
        allowed_origins.append(env_origin)
    
    CORS(app,
        supports_credentials=True,
        origins=allowed_origins,
        expose_headers=["Content-Type", "Authorization"],
        allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

# Apply CORS configuration
configure_cors(app)


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

# these routes after your blueprint registrations help debug seeding in postresql


@app.route('/seed-db') #/seed-db - Only adds data if database is empty (safe to run anytim
def seed_database():
    """Safe seeding - only adds data if database is empty"""
    try:
        print("🌱 Starting safe database seeding...")
        from seed import run_seed
        run_seed()
        return "Database seeding completed safely!"
    except Exception as e:
        return f"Seeding error: {str(e)}", 500


@app.route('/reset-db') #Complete reset (only use when you want to start fresh)
def reset_database():
    """DANGER: Completely resets database - use with caution!"""
    try:
        print("⚠️ RESETTING DATABASE - This will delete ALL data!")
        from models import db
        
        db.drop_all()
        db.create_all()
        
        # Import and run the seed function
        from seed import run_seed
        run_seed()
        
        return "Database completely reset with seed data!"
    except Exception as e:
        return f"Reset error: {str(e)}", 500


@app.route('/health')
def health_check():
    try:
        from models import User, Admin, Route
        user_count = User.query.count()
        admin_count = Admin.query.count()
        route_count = Route.query.count()
        return {
            "status": "healthy",
            "database": "connected",
            "users": user_count,
            "admins": admin_count,
            "routes": route_count
        }
    except Exception as e:
        return f"Database connection error: {str(e)}", 500


        