import bcrypt
import requests
from math import radians, cos, sin, asin, sqrt
from app import app
from models import db, Admin, User, Route, Bus, Booking, Pickup_Dropoff_Location
from datetime import date
import os
from dotenv import load_dotenv #for hiding google map api

# Google Maps Geocoding API key 
load_dotenv() 

GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
if not GOOGLE_API_KEY:
    raise Exception("Missing GOOGLE_MAPS_API_KEY environment variable")
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"

def geocode_location(name):
    params = {
        "address": name,
        "key": GOOGLE_API_KEY
    }
    resp = requests.get(GEOCODE_URL, params=params)
    if resp.status_code != 200:
        raise Exception(f"Geocoding request failed with status {resp.status_code}")
    data = resp.json()
    if data['status'] != "OK" or not data['results']:
        raise Exception(f"Geocoding failed for '{name}': {data['status']}")
    location = data['results'][0]['geometry']['location']
    return location['lat'], location['lng']

def haversine(lat1, lon1, lat2, lon2):
    # Convert decimal degrees to radians 
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    # Haversine formula 
    dlat = lat2 - lat1 
    dlon = lon2 - lon1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers
    return c * r

with app.app_context():
    db.drop_all()
    db.create_all()

    # -------- Admin --------
    hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    admin = Admin(name="Admin", email="admin@gmail.com", password=hashed_password, role="Superadmin")
    db.session.add(admin)
    db.session.commit()

    # -------- Users --------
    users = [
        User(name="Ella Leala", email="leala@gmail.com", password=bcrypt.hashpw("leala123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')),
        User(name="Mary Wambui", email="wambui@gmail.com", password=bcrypt.hashpw("wambui456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')),
        User(name="David Kori", email="kori@gmail.com", password=bcrypt.hashpw("@david123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')),
        User(name="Maxwell Ndiritu", email="ndiritu@gmail.com", password=bcrypt.hashpw("max#33".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'))
    ]
    db.session.add_all(users)
    db.session.commit()

    # -------- Routes --------
    route_names = ["Thika Road", "Mombasa Road", "Waiyaki Way", "Jogoo Road", "Kilimani", "Parklands"]
    routes = [Route(route_name=name) for name in route_names]
    db.session.add_all(routes)
    db.session.commit()

    # -------- Buses --------
    buses_data = [
        (0, "KCA 123A", 33),
        (0, "KCB 456B", 25),
        (1, "KCC 789C", 40),
        (1, "KCD 321D", 28),
        (2, "KCE 654E", 30),
        (2, "KCF 987F", 35),
        (3, "KCR 881F", 40),
        (3, "KBE 527R", 35),
    ]
    buses = []
    for route_index, plate, capacity in buses_data:
        buses.append(Bus(route=routes[route_index], numberplate=plate, capacity=capacity))
    db.session.add_all(buses)
    db.session.commit()

    # -------- Pickup & Dropoff Locations --------
    location_data = {
        "Thika Road": ["Kasarani", "Muthaiga", "Globe/CBD Entrance"],
        "Mombasa Road": ["Syokimau", "Cabanas", "South B"],
        "Waiyaki Way": ["Kikuyu", "Uthiru", "Westlands"],
        "Jogoo Road": ["Donholm", "Jericho", "City Stadium / Muthurwa"],
        "Kilimani": ["Adams Arcade", "Yaya Centre", "Kileleshwa"],
        "Parklands": ["Westlands", "Parklands"]
    }

    pickup_dropoffs = []
    for route in routes:
        names = location_data.get(route.route_name, [])
        for name in names:
            lat, lng = geocode_location(name)
            pickup_dropoffs.append(Pickup_Dropoff_Location(
                name_location=name,
                GPSystem=f"{lat},{lng}",
                route=route
            ))

    db.session.add_all(pickup_dropoffs)
    db.session.commit()

    # Helper to find location by name
    def find_location(name):
        for loc in pickup_dropoffs:
            if loc.name_location == name:
                lat, lng = map(float, loc.GPSystem.split(','))
                return lat, lng
        raise ValueError(f"Location '{name}' not found")

    # -------- Bookings --------
    #  some sample bookings for users
    bookings_data = [
        # (user_index, bus_index, pickup_name, dropoff_name, seats, booking_date)
        (0, 0, "Kasarani", "Muthaiga", 2, date(2025, 8, 1)),
        (1, 1, "Globe/CBD Entrance", "Kasarani", 1, date(2025, 8, 3)),
        (0, 1, "Muthaiga", "Globe/CBD Entrance", 3, date(2025, 8, 5)),
        (1, 0, "Globe/CBD Entrance", "Muthaiga", 4, date(2025, 8, 7)),
    ]

    bookings = []
    for user_idx, bus_idx, pickup_name, dropoff_name, seats, b_date in bookings_data:
        plat, plng = find_location(pickup_name) #plat is pickup lat
        dlat, dlng = find_location(dropoff_name)
        distance_km = haversine(plat, plng, dlat, dlng)
        price = round(distance_km * 5, 2)  # 5 KES per km
        bookings.append(Booking(
            user_id=users[user_idx].id,
            bus_id=buses[bus_idx].id,
            pickup_location=pickup_name,
            dropoff_location=dropoff_name,
            seats_booked=seats,
            booking_date=b_date,
            price=price
        ))

    db.session.add_all(bookings)
    db.session.commit()

    print("Seeding Complete!")
