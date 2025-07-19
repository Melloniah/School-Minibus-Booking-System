import bcrypt
from app import app
from models import db, Admin

with app.app_context():
    db.drop_all()
    db.create_all()

    hashed_password = bcrypt.hashpw("alice123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Admin creation
    admin = Admin(
        name="Admin",
        email="admin@gmail.com",
        password=hashed_password,
        role="Superadmin"
    )

    db.session.add(admin)
    db.session.commit()