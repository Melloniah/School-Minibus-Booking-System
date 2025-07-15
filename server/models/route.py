from . import db

class Route(db.Model):
    __tablename__ = 'routes'

    id = db.Column(db.Integer, primary_key=True)
    origin = db.Column(db.String(100))
    destination = db.Column(db.String(100))
    buses = db.relationship('Bus', back_populates='route')
    pickup_dropoff_locations = db.relationship('PickupDropoffLocation', back_populates='route')
