from app import create_app
from models import db

app = create_app() # calls factory to create instance

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # tells to create all database tables
    app.run(port=5555,debug=True)