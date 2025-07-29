# 🚐 School Minibus Booking System

A full-stack web platform for safe, affordable, and trackable school transportation. Parents can book minibus seats, view routes, and track their child’s school commute in real-time.

> Built with **Next.js** (frontend) and **Flask** (backend), powered by **PostgreSQL**.

---

## 🧠 Problem

In many developing regions, school-going children face:

- 🚶‍♂️ Long, unsafe walks to school  
- 🚎 Unreliable or nonexistent public transport  
- 🚖 Expensive private alternatives  
- 👀 No visibility or assurance on student safety during commute  

---

## ✅ Solution

Our platform enables:

- 🔒 Secure parent/student registration  
- 🗺️ Interactive route selection using maps  
- 🚌 Seat booking on fixed school routes  
- 📍 Real-time location tracking of minibuses  
- 📲 Notifications for pickup/drop-off events  
- 🛠️ Admin panel to manage buses, routes, and drivers  

---

## 🧱 Tech Stack

| Layer        | Technologies                               |
|--------------|--------------------------------------------|
| **Frontend** | Next.js, Tailwind CSS, Google Maps API     |
| **Backend**  | Flask, Flask-JWT-Extended, SQLAlchemy      |
| **Database** | PostgreSQL                                 ||

---

## 🔍 Key Features

### 👨‍👩‍👧 Parents
- Register/Login  
- Browse available routes on an interactive map  
- Select pickup/drop-off points  
- Book seats for students  
- Live bus tracking  
- Receive SMS / push notifications  

### 🛠️ Admins
- Manage routes, buses, drivers  
- View/manage bookings  
- Add pickup and drop-off points  
- Monitor system activity  

---

## 🚀 MVP Timeline (3 Weeks)

| Week | Deliverables |
|------|--------------|
| 1    | Auth system, route models, Flask setup, basic frontend UI |
| 2    | Booking system, admin dashboard, full API integration     |
| 3    | Google Maps, bus tracking, notification integration       |

---

## 🔧 How It Works

### 🧭 User Flow

```text
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
🔌 REST API Endpoints
🧑‍💼 Authentication
Method	Endpoint	Description
POST	/api/register	Register user/admin
POST	/api/login	Login and get token

🚌 Routes
Method	Endpoint	Description
GET	/api/routes	Get all routes
POST	/api/routes	Admin creates route

📍 Locations
Method	Endpoint	Description
POST	/api/locations	Create pickup/drop-off point

📖 Bookings
Method	Endpoint	Description
POST	/api/bookings	Book a seat
GET	/api/bookings/<user_id>	Get user bookings

🛠️ Project Structure

School-Minibus-Booking-System/
├── client/                  # Next.js frontend
│   └── pages/               # React pages
├── server/                  # Flask backend
│   ├── models/              # SQLAlchemy models
│   ├── routes/              # Flask Blueprints
│   ├── seed.py              # Sample data script
│   ├── app.py               # Flask app entry
├── .env.example             # Example environment vars
├── README.md                # Project docs
└── requirements.txt         # Backend dependencies
⚙️ Setup Instructions
💻 Frontend Setup

# Navigate to frontend folder
cd client

# Install dependencies
npm install

# Run development server
npm run dev
🐍 Backend Setup
# Navigate to server folder
cd server

# Create virtual environment (optional if using pipenv)
pipenv install && pipenv shell

# Install dependencies
pip install -r requirements.txt

# Run migrations
flask db init
flask db migrate
flask db upgrade

# Seed the database
python seed.py

# Start the Flask server
python server.py

🔌 Ports
Service	Port	URL
Frontend	3000	http://localhost:3000
Backend	5000	http://localhost:5000/api

🧪 Prerequisites
Node.js v18+

Python 3.10+

PostgreSQL 

Google Maps API Key


🔑 Environment Variables
Create a .env file in /server with:

FLASK_APP=app
FLASK_ENV=development
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_key
GOOGLE_MAPS_API_KEY=your_api_key

👥 Collaborators
Joan Kori

Elsie Oscar

Mellon Obada

Brian Mongare

Rosemary Kamau

Yelsin Kiprop

📜 License
This project is licensed under the MIT License.
