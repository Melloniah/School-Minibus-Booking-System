from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .route import Route
from .pickup_dropoff_location import Pickup_Dropoff_Location  
from .bus import Bus 
from .Booking import Booking 
