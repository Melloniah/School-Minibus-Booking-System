from flask import request, jsonify
from sqlalchemy import func
from models.route import Route
from models.bus import Bus
from models.booking import Booking
from models.pickup_dropoff_location import Pickup_Dropoff_Location 
from datetime import datetime, timedelta
from middleware.authMiddleware import jwt_protected
from models import db
import os
import requests # Import the requests library



GOOGLE_API_KEY = os.getenv('Maps_API_KEY')

def geocode_location(name):
    url = f'https://maps.googleapis.com/maps/api/geocode/json?address={name}&key={GOOGLE_API_KEY}'
    response = requests.get(url)
    data = response.json()

    if data['status'] == 'OK':
        location = data['results'][0]['geometry']['location']
        return location['lat'], location['lng']
    return None, None

@jwt_protected(role='admin')
def create_route(current_admin):
    data = request.get_json()
    print("Received route data:", data)
    
    # Validate required field
    if 'route_name' not in data:
        return jsonify({'error': 'Missing route_name'}), 400

    # Create new Route
    route = Route(route_name=data['route_name'])
    db.session.add(route)
    db.session.flush()  # Get route.id before committing

    # Handle locations
    locations = data.get('locations', [])
    for loc in locations:
        name = loc.get('name_location')
        if not name:
            continue  # Skip if name is missing

        # Use geocoding to get lat/lng from name
        lat = loc.get('latitude')
        lng = loc.get('longitude')

        if lat is None or lng is None:
            lat, lng = geocode_location(name)

        if lat is None or lng is None:
            continue  # Still skip if nothing found


        new_location = Pickup_Dropoff_Location(
            name_location=name,
            latitude=lat,
            longitude=lng,
            route_id=route.id
        )
        db.session.add(new_location)

    db.session.commit()

    # Serialize response
    return jsonify({
        'id': route.id,
        'route_name': route.route_name,
        'locations': [loc.serialize() for loc in route.pickup_dropoff_locations]
    }), 201

    

# @jwt_protected()
def get_routes(current_user_or_admin):
    routes = Route.query.all()
    return jsonify([
        {
            'id': r.id,
            'name': r.route_name,
            'route_name': r.route_name,
            'stops': [loc.name_location for loc in r.pickup_dropoff_locations],
            'emoji': get_route_emoji(r),
            'status': get_route_status_with_bookings(r),
            'available_seats': get_available_seats_today(r),
            'total_buses': len(r.buses),
            'next_available': get_next_available_slot(r)
        }
        for r in routes
    ])

@jwt_protected()
def get_route(current_user_or_admin,id):
    route = Route.query.get_or_404(id)
    buses = [
        {'id': b.id, 'numberplate': b.numberplate, 'capacity': b.capacity}
        for b in route.buses
    ]
    return jsonify({
        'id': route.id,
        'route_name':route.route_name,
        'buses': buses
    })


@jwt_protected(role='admin')
def update_route(current_admin,id):
    route = Route.query.get_or_404(id)
    data = request.json
    if 'route_name' in data:
        route.route_name = data['route_name']
    db.session.commit()
    return jsonify({'id': route.id, 'route_name': route.route_name})


@jwt_protected(role='admin')
def delete_route(current_admin,id):
    route = Route.query.get_or_404(id)
    db.session.delete(route)
    db.session.commit()
    return jsonify({'message': 'Route deleted'})

 
    # Booking AVAILABILITY BASED ON BUSES ON THE ROUTES AND SEATS AVAILABLE    
def get_route_status_with_bookings(route):
    """Get route status based on current bookings and bus availability"""
    
    # Check if route has any buses
    if not route.buses or len(route.buses) == 0:
        return 'No Service'
    
    # Get today's date
    today = datetime.now().date()
    
    # Count total seats booked for today on this route
    total_booked_today = db.session.query(func.sum(Booking.seats_booked)).filter(
        Booking.bus_id.in_([bus.id for bus in route.buses]),
        Booking.booking_date == today
    ).scalar() or 0
    
    # Calculate total capacity for all buses on this route
    total_capacity = sum(bus.capacity for bus in route.buses)
    
    if total_capacity == 0:
        return 'No Service'
    
    # Calculate occupancy rate for today
    occupancy_rate = (total_booked_today / total_capacity) * 100
    
    # Determine status based on occupancy
    if occupancy_rate >= 95:
        return 'Full'
    elif occupancy_rate >= 80:
        return 'Limited'
    elif occupancy_rate >= 60:
        return 'Filling Up'
    else:
        return 'Available'


def get_available_seats_today(route):
    """Get available seats for the route today"""
    if not route.buses:
        return 0
    
    today = datetime.now().date()
    
    # Count total seats booked today
    total_booked_today = db.session.query(func.sum(Booking.seats_booked)).filter(
        Booking.bus_id.in_([bus.id for bus in route.buses]),
        Booking.booking_date == today
    ).scalar() or 0
    
    # Calculate total capacity
    total_capacity = sum(bus.capacity for bus in route.buses)
    
    return max(0, total_capacity - total_booked_today)

def get_next_available_slot(route):
    """Get next available time slot based on current bookings"""
    if not route.buses:
        return 'No Service'
    
    available_seats_today = get_available_seats_today(route)
    
    if available_seats_today > 0:
        return 'Today'
    else:
        # Check tomorrow
        tomorrow = datetime.now().date() + timedelta(days=1)
        
        tomorrow_booked = db.session.query(func.sum(Booking.seats_booked)).filter(
            Booking.bus_id.in_([bus.id for bus in route.buses]),
            Booking.booking_date == tomorrow
        ).scalar() or 0
        
        total_capacity = sum(bus.capacity for bus in route.buses)
        
        if tomorrow_booked < total_capacity:
            return 'Tomorrow'
        else:
            return 'Check Later'

def get_route_emoji(route):
    """Dynamic emoji based on route status"""
    status = get_route_status_with_bookings(route)
    
    emoji_map = {
        'Available': '🚌',
        'Filling Up': '🚐',
        'Limited': '🟡',
        'Full': '🔴',
        'No Service': '⚠️'
    }
    
    return emoji_map.get(status, '🚌')

@jwt_protected()
def get_route_detailed_status(current_user_or_admin, route_id):
    """Get detailed status for a specific route"""
    route = Route.query.get_or_404(route_id)
    today = datetime.now().date()
    
    week_ago = today - timedelta(days=7)
    
    weekly_bookings = db.session.query(
        Booking.booking_date,
        func.sum(Booking.seats_booked).label('total_seats')
    ).filter(
        Booking.bus_id.in_([bus.id for bus in route.buses]),
        Booking.booking_date >= week_ago,
        Booking.booking_date <= today
    ).group_by(Booking.booking_date).all()
    
    return jsonify({
        'id': route.id,
        'name': route.route_name,
        'status': get_route_status_with_bookings(route),
        'available_seats_today': get_available_seats_today(route),
        'total_capacity': sum(bus.capacity for bus in route.buses),
        'total_buses': len(route.buses),
        'weekly_stats': [
            {
                'date': booking.booking_date.isoformat(),
                'seats_booked': booking.total_seats
            }
            for booking in weekly_bookings
        ]
    })        