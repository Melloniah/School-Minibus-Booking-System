import bcrypt
from app import app
from models import db, Admin, User, Route, Bus, Booking, Pickup_Dropoff_Location
from datetime import date

with app.app_context():
    db.drop_all()
    db.create_all()

    # ---------------- Admin ----------------
    hashed_password = bcrypt.hashpw("alice123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    admin = Admin(
        name="Admin",
        email="admin@gmail.com",
        password=hashed_password,
        role="Superadmin"
    )
    db.session.add(admin)

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

    # ---------------- Routes ----------------
    routes = [
        Route(origin="Thika", destination="Ruiru"),
        Route(origin="Survey", destination="CBD"),
        Route(origin="CBD", destination="Westlands"),
        Route(origin="Allsops", destination="Utawala"),
        Route(origin="CBD", destination="Kiserian"),
        Route(origin="Karen", destination="Kiambu Road")
    ]
    db.session.add_all(routes)

    # ---------------- Buses ----------------
    buses = [
        Bus(route=routes[0], numberplate="KCA 123A", capacity=33),
        Bus(route=routes[1], numberplate="KCB 456B", capacity=25),
        Bus(route=routes[2], numberplate="KCC 789C", capacity=40),
        Bus(route=routes[3], numberplate="KCD 321D", capacity=28),
        Bus(route=routes[4], numberplate="KCE 654E", capacity=30),
        Bus(route=routes[5], numberplate="KCF 987F", capacity=35),
    ]
    db.session.add_all(buses)

    # ---------------- Pickup & Dropoff Locations with real coordinates ----------------
    pickup_dropoffs = [
        Pickup_Dropoff_Location(name_location="Thika Main Stage", GPSystem="-1.0341, 37.0693", route=routes[0]),
        Pickup_Dropoff_Location(name_location="Ruiru Spur Mall", GPSystem="-1.1450, 36.9566", route=routes[0]),

        Pickup_Dropoff_Location(name_location="Survey Bus Stop", GPSystem="-1.2290, 36.8835", route=routes[1]),
        Pickup_Dropoff_Location(name_location="Kencom CBD", GPSystem="-1.2866, 36.8219", route=routes[1]),

        Pickup_Dropoff_Location(name_location="Kencom CBD", GPSystem="-1.2866, 36.8219", route=routes[2]),
        Pickup_Dropoff_Location(name_location="Westlands Sarit Centre", GPSystem="-1.2648, 36.8032", route=routes[2]),

        Pickup_Dropoff_Location(name_location="Allsops", GPSystem="-1.2232, 36.8826", route=routes[3]),
        Pickup_Dropoff_Location(name_location="Utawala Stage", GPSystem="-1.2880, 36.9558", route=routes[3]),

        Pickup_Dropoff_Location(name_location="Kencom CBD", GPSystem="-1.2866, 36.8219", route=routes[4]),
        Pickup_Dropoff_Location(name_location="Kiserian Town", GPSystem="-1.3956, 36.7070", route=routes[4]),

        Pickup_Dropoff_Location(name_location="Karen Hub Mall", GPSystem="-1.3176, 36.7198", route=routes[5]),
        Pickup_Dropoff_Location(name_location="Kiambu Road Quickmart", GPSystem="-1.2087, 36.8400", route=routes[5]),
    ]
    db.session.add_all(pickup_dropoffs)

    # ---------------- Bookings ----------------
    booking1 = Booking(
        user=user1,
        bus=buses[0],
        pickup_location="Thika Main Stage",
        dropoff_location="Ruiru Spur Mall",
        seats_booked=2,
        booking_date=date.today(),
        price=200.0
    )

    booking2 = Booking(
        user=user2,
        bus=buses[2],
        pickup_location="Kencom CBD",
        dropoff_location="Westlands Sarit Centre",
        seats_booked=1,
        booking_date=date.today(),
        price=150.0
    )

    db.session.add_all([booking1, booking2])
    db.session.commit()

    print("Seeding Complete !")
