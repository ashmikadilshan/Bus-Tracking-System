from flask import Blueprint, request, jsonify
from backend.database import db
from backend.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'passenger')
    if not username or not password:
        return jsonify({'msg': 'username and password required'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'msg': 'username exists'}), 400
    hashed = generate_password_hash(password)
    user = User(username=username, password=hashed, role=role)
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'registered', 'user': user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'msg': 'bad credentials'}), 401
    token = create_access_token(identity={'id': user.id, 'role': user.role})
    return jsonify({'access_token': token, 'user': user.to_dict()})
