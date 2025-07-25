import bcrypt
from app import app
from models import db, Admin, User, Route, Bus, Booking, Pickup_Dropoff_Location
from datetime import date

with app.app_context():
    db.drop_all()
    db.create_all()

    # ---------------- Admin ----------------
    hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    admin = Admin(
        name="Admin",
        email="admin@gmail.com",
        password=hashed_password,
        role="Superadmin"
    )
    db.session.add(admin)
    db.session.commit()

    # ---------------- Users ----------------
    leala = bcrypt.hashpw("leala123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    Mary = bcrypt.hashpw("wambui456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    David = bcrypt.hashpw("@david123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    Maxwell = bcrypt.hashpw("max#33".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user1 = User(name="Ella Leala", email="leala@gmail.com", password=leala)
    user2 = User(name="Mary Wambui", email="wambui@gmail.com", password=Mary)
    user3 = User(name="David Kori", email="kori@gmail.com", password=David)
    user4 = User(name="Maxwell Ndiritu", email="ndiritu@gmail.com", password=Maxwell)


    db.session.add_all([user1, user2, user3, user4])
    db.session.commit()

    # ---------------- Routes ----------------
    routes = [
        Route(route_name="Thika Road"),
        Route(route_name="Ngong Road"),
        Route(route_name="Mombasa Road"),
        Route(route_name="Kiambu Road")
    ]
    db.session.add_all(routes)
    db.session.commit()

    # ---------------- Buses ----------------
    
    bus1=Bus(route=routes[0], numberplate="KCA 123A", capacity=33),
    bus2=Bus(route=routes[0], numberplate="KCB 456B", capacity=25),
    bus3=Bus(route=routes[1], numberplate="KCC 789C", capacity=40),
    bus4=Bus(route=routes[1], numberplate="KCD 321D", capacity=28),
    bus5=Bus(route=routes[2], numberplate="KCE 654E", capacity=30),
    bus6=Bus(route=routes[2], numberplate="KCF 987F", capacity=35),
    bus7=Bus(route=routes[3], numberplate="KCR 881F", capacity=40),
    bus8=Bus(route=routes[3], numberplate="KBE 527R", capacity=35)
    
    db.session.add_all(bus1,bus2,bus3,bus4,bus5,bus6,bus7,bus8)
    db.session.commit()

    # ---------------- Pickup & Dropoff Locations with real coordinates ----------------
    pickup_dropoffs = [
        Pickup_Dropoff_Location(name_location="Thika Main Stage", GPSystem="-1.0341, 37.0693", route=routes[0]),
        Pickup_Dropoff_Location(name_location="Ruiru Spur Mall", GPSystem="-1.1450, 36.9566", route=routes[0]),
        Pickup_Dropoff_Location(name_location="Survey Bus Stop", GPSystem="-1.2290, 36.8835", route=routes[0]),
        Pickup_Dropoff_Location(name_location="Junction Mall", GPSystem="1.2985, 36.7625", route=routes[1]),
        Pickup_Dropoff_Location(name_location="Moringa School", GPSystem="1.2860, 36.7997", route=routes[1]),
        Pickup_Dropoff_Location(name_location="Lenana School", GPSystem="1.3000, 36.7284", route=routes[1]),
        Pickup_Dropoff_Location(name_location="The Imaara Mall", GPSystem="1.3283, 36.8819", route=routes[2]),
        Pickup_Dropoff_Location(name_location="Nairobi South Primary", GPSystem="-1.38, 36.83", route=routes[2]),
        Pickup_Dropoff_Location(name_location="Signature Mall", GPSystem="-1.41752, 36.9535", route=routes[2]),
        Pickup_Dropoff_Location(name_location="Two Rivers Mall", GPSystem="1.2118, 36.7957", route=routes[3]),
        Pickup_Dropoff_Location(name_location="Ridgeways Mall", GPSystem="-1.22547, 36.83993", route=routes[3]),

    ]
    db.session.add_all(pickup_dropoffs)
    db.session.commit()

    # ---------------- Bookings ----------------
    booking1 = Booking(
        user_id=user1.id,
        bus_id=bus1.id,
        pickup_location=location1.name_location,
        dropoff_location=location2.name_location,
        seats_booked=2,
        booking_date=date(2025, 8, 1),
        price=100.0
    )

    booking2 = Booking(
        user_id=user2.id,
        bus_id=bus2.id,
        pickup_location=location3.name_location,
        dropoff_location=location1.name_location,
        seats_booked=1,
        booking_date=date(2025, 8, 3),
        price=60.0
    )
    
    # New bookings
    booking3 = Booking(
        user_id=user1.id,
        bus_id=bus2.id,
        pickup_location=location2.name_location,
        dropoff_location=location3.name_location,
        seats_booked=3,
        booking_date=date(2025, 8, 5),
        price=90.0
    )
    
    booking4 = Booking(
        user_id=user2.id,
        bus_id=bus1.id,
        pickup_location=location3.name_location,
        dropoff_location=location2.name_location,
        seats_booked=4,
        booking_date=date(2025, 8, 7),
        price=180.0
    )

    db.session.add_all([booking1, booking2, booking3, booking4])
    db.session.commit()


    print("Seeding Complete !")
