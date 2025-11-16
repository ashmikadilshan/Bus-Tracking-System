from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:////xampp/htdocs/OnlineBusTrackingSystem/dev.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret')

from backend.database import db
db.init_app(app)

jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins='*')

# import models so tables are registered
from backend.models.user import User
from backend.models.bus import Bus
from backend.models.driver import Driver
from backend.models.route import Route
from backend.models.trip import Trip

# Register blueprints
from backend.routes.auth import auth_bp
from backend.routes.admin import admin_bp
from backend.routes.driver import driver_bp
from backend.routes.passenger import passenger_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(driver_bp, url_prefix='/api/driver')
app.register_blueprint(passenger_bp, url_prefix='/api/passenger')

# Socket events
from backend.controllers.realtime import register_socket_handlers
register_socket_handlers(socketio)

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    # Create tables if using SQLite during development
    with app.app_context():
        db.create_all()
        
        # Create default admin account if it doesn't exist
        from werkzeug.security import generate_password_hash
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                password=generate_password_hash('admin123'),
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
            print("✓ Default admin created: username='admin', password='admin123'")
    
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
