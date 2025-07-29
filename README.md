## School Minibus Booking System
A full-stack web platform for safe, affordable, and trackable school transportation. Parents can book minibus seats, view routes, and track their child’s school commute in real-time.

Built with Next.js (frontend) and Flask (backend), powered by PostgreSQL.

## Problem
In many developing regions, school-going children face:

. Long, unsafe walks to school

. Unreliable or nonexistent public transport

  Expensive private alternatives

  No visibility or assurance on student safety during commute

##  Solution
Our platform empowers:

 Secure parent/student registration

 Interactive route selection using maps

 Seat booking on fixed school routes

 Real-time location tracking of minibuses

 Notifications for pickup/drop-off events

Admin panel to manage buses, routes, and drivers

## Tech Stack
Layer	Technologies
Frontend	Next.js, Tailwind CSS, Google Maps API
Backend	Flask, Flask-JWT-Extended, SQLAlchemy
Database	PostgreSQL


## Key Features
   For Parents
Register and log in

Browse available routes on an interactive map

Select pickup/drop-off points

Book seats for students

Live bus tracking

Receive SMS / push notifications

# For Admins
Manage routes, buses, drivers

View/manage bookings

Add pickup and drop-off points

Monitor overall system activity

# MVP Timeline (3 Weeks)
Week	Deliverables
1	Auth system, route models, Flask setup, basic frontend UI
2	Booking system, admin dashboard, full API integration
3	Google Maps, bus tracking, notification integration

## How It Works
# User Flow
Parents
   ↓
Register/Login
   ↓
Choose Route & Pickup Location
   ↓
Book Seat
   ↓
Receive Notifications + Track Bus Live

Admins
   ↓
Login
   ↓
Create Routes & Buses
   ↓
Manage Bookings
   ↓
Monitor Routes
## REST API Endpoints
  # Authentication
Method	Endpoint	Description
POST	/api/register	Register user/admin
POST	/api/login	Login and get token

# Routes
Method	Endpoint	Description
GET	/api/routes	Get all routes
POST	/api/routes	Admin creates route

# Locations
Method	Endpoint	Description
POST	/api/locations	Create pickup/drop-off point

# Bookings
Method	Endpoint	Description
POST	/api/bookings	Book a seat
GET	/api/bookings/<user_id>	Get user bookings

## Setup Instructions
  #  Frontend Setup
bash

# Navigate to frontend folder
cd client

# Install dependencies
npm install

# Run development server
npm run dev 

# Backend Setup

# Navigate to server folder
cd server

# Create virtual environment (optional if using pipenv)
pipenv install && pipenv shell

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Run migrations
flask db init
flask db migrate
flask db upgrade

# Seed the database
python seed.py

# Start the Flask server
flask run
## Prerequisites
Node.js v18+

Python 3.10+

PostgreSQL (or Supabase)

Google Maps API key (for frontend map + backend geocoding)

## Collaborators
Joan Kori

Elsie Oscar

Mellon Obada

Brian Mongare

Rosemary Kamau

Yelsin Kiprop

## License
This project is licensed under the MIT License.
