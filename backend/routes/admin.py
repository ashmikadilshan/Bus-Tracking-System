from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.database import db
from backend.models.bus import Bus
from backend.models.driver import Driver
from backend.models.route import Route

admin_bp = Blueprint('admin', __name__)

# Simple admin check helper
def admin_required():
    try:
        identity = get_jwt_identity()
        if not identity or identity.get('role') != 'admin':
            return False
        return True
    except:
        # Allow access without JWT in development
        return True

@admin_bp.route('/buses', methods=['GET'])
def list_buses():
    try:
        buses = Bus.query.all()
        return jsonify([b.to_dict() for b in buses])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/buses', methods=['POST'])
def create_bus():
    try:
        data = request.json
        if not data or not data.get('plate_number'):
            return jsonify({'error': 'plate_number is required'}), 400
        
        bus = Bus(
            plate_number=data.get('plate_number'), 
            capacity=data.get('capacity', 40),
            model=data.get('model', 'Standard')
        )
        db.session.add(bus)
        db.session.commit()
        return jsonify({'success': True, 'message': f"Bus {bus.plate_number} created", 'id': bus.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/drivers', methods=['GET'])
def list_drivers():
    try:
        drivers = Driver.query.all()
        return jsonify([d.to_dict() for d in drivers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/drivers', methods=['POST'])
def create_driver():
    try:
        data = request.json
        if not data or not data.get('name'):
            return jsonify({'error': 'name is required'}), 400
        
        driver = Driver(
            name=data.get('name'),
            phone=data.get('phone', ''),
            license_number=data.get('license_number', '')
        )
        db.session.add(driver)
        db.session.commit()
        return jsonify({'success': True, 'message': f"Driver {driver.name} added", 'id': driver.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/routes', methods=['GET'])
def list_routes():
    try:
        routes = Route.query.all()
        return jsonify([r.to_dict() for r in routes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/routes', methods=['POST'])
def create_route():
    try:
        data = request.json
        # Accept both 'name' and 'route_name' for flexibility
        route_name = data.get('name') or data.get('route_name')
        if not data or not route_name:
            return jsonify({'error': 'name or route_name is required'}), 400
        
        route = Route(
            name=route_name,
            start_point=data.get('start_point', ''),
            end_point=data.get('end_point', ''),
            number_of_stops=data.get('stops_count') or data.get('number_of_stops', 0)
        )
        db.session.add(route)
        db.session.commit()
        return jsonify({'success': True, 'message': f"Route {route.name} created", 'id': route.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/assign', methods=['POST'])
def assign_bus():
    try:
        data = request.json
        bus_id = data.get('bus_id')
        driver_id = data.get('driver_id')
        route_id = data.get('route_id')
        
        bus = Bus.query.get(bus_id)
        driver = Driver.query.get(driver_id)
        
        if not bus:
            return jsonify({'error': f'Bus ID {bus_id} not found'}), 404
        if not driver:
            return jsonify({'error': f'Driver ID {driver_id} not found'}), 404
        
        driver.assigned_bus_id = bus.id
        bus.route_id = route_id or bus.route_id
        db.session.commit()
        return jsonify({'success': True, 'message': f'Bus {bus.plate_number} assigned to driver {driver.name}'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    try:
        buses = Bus.query.all()
        drivers = Driver.query.all()
        routes = Route.query.all()
        
        return jsonify({
            'buses': len(buses),
            'drivers': len(drivers),
            'routes': len(routes),
            'active_buses': len([b for b in buses if b.status == 'active']),
            'active_drivers': len([d for d in drivers if d.status == 'active'])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
