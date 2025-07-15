from . import db

class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.id'), nullable=False)
    pickup_location = db.Column(db.String, nullable=False)
    dropoff_location = db.Column(db.String, nullable=False)
    seats_booked = db.Column(db.Integer, nullable=False)
    booking_date = db.Column(db.Date, nullable=False)
    price = db.Column(db.Float, nullable=False)

    user = db.relationship('User', back_populates='booking')
    bus = db.relationship('Bus', back_populates='booking')

    def __repr__(self):
        return f'<Booking {self.id} for User {self.user_id} ,Bus {self.bus_id} on {self.date}>'