USE online_bus_tracking;

-- Users: admin, driver, passenger
INSERT INTO users (username, password, role) VALUES
('admin', '$2b$12$adminhashplaceholder', 'admin'),
('driver1', '$2b$12$driverhashplaceholder', 'driver'),
('driver2', '$2b$12$driverhashplaceholder', 'driver'),
('driver3', '$2b$12$driverhashplaceholder', 'driver'),
('passenger1', '$2b$12$passengerhashplaceholder', 'passenger'),
('passenger2', '$2b$12$passengerhashplaceholder', 'passenger');

-- Drivers
INSERT INTO drivers (name, phone, user_id) VALUES
('John Doe', '+1234567890', 2),
('Jane Smith', '+1234567891', 3),
('Michael Johnson', '+1234567892', 4);

-- Routes with realistic map coordinates (Colombo, Sri Lanka)
-- Route A: Fort to Dehiwala (Main coastal route)
INSERT INTO routes (name, waypoints) VALUES
('Route A - Fort to Dehiwala', '[
  {"lat":6.9271,"lng":79.8612,"name":"Fort Station"},
  {"lat":6.9250,"lng":79.8620,"name":"Slave Island"},
  {"lat":6.9200,"lng":79.8500,"name":"Galle Face"},
  {"lat":6.9150,"lng":79.8450,"name":"Colombo 3"},
  {"lat":6.9050,"lng":79.8300,"name":"Colombo 5"},
  {"lat":6.8900,"lng":79.8100,"name":"Wellawatte"},
  {"lat":6.8700,"lng":79.7900,"name":"Mount Lavinia"},
  {"lat":6.8500,"lng":79.7700,"name":"Dehiwala"}
]');

-- Route B: Colombo to Kandy (Upcountry route)
INSERT INTO routes (name, waypoints) VALUES
('Route B - Colombo to Kandy', '[
  {"lat":6.9271,"lng":79.8612,"name":"Colombo Central"},
  {"lat":6.9350,"lng":79.8570,"name":"Colombo North"},
  {"lat":7.0500,"lng":79.9000,"name":"Gampaha"},
  {"lat":7.2500,"lng":80.5000,"name":"Kegalle"},
  {"lat":7.3000,"lng":80.6200,"name":"Kandy Central"}
]');

-- Route C: Colombo Airport to City Center
INSERT INTO routes (name, waypoints) VALUES
('Route C - Airport Express', '[
  {"lat":6.9200,"lng":79.8900,"name":"Colombo International Airport"},
  {"lat":6.9300,"lng":79.8800,"name":"Airport Road"},
  {"lat":6.9350,"lng":79.8700,"name":"Colombo 2"},
  {"lat":6.9271,"lng":79.8612,"name":"Colombo Central"}
]');

-- Route D: Colombo South Loop
INSERT INTO routes (name, waypoints) VALUES
('Route D - South Loop', '[
  {"lat":6.9000,"lng":79.8600,"name":"Colpetty"},
  {"lat":6.8900,"lng":79.8700,"name":"Bambalapitiya"},
  {"lat":6.8700,"lng":79.8500,"name":"Wellawatte"},
  {"lat":6.8500,"lng":79.8300,"name":"Galle"},
  {"lat":6.8300,"lng":79.8100,"name":"Matara"}
]');

-- Buses with realistic coordinates and status
-- Bus 1 - Route A
INSERT INTO buses (plate_number, capacity, route_id, current_lat, current_lng, speed, status) VALUES
('BUS-1001', 50, 1, 6.9250, 79.8620, 25.5, 'running');

-- Bus 2 - Route B
INSERT INTO buses (plate_number, capacity, route_id, current_lat, current_lng, speed, status) VALUES
('BUS-1002', 45, 2, 7.0500, 79.9000, 60.0, 'running');

-- Bus 3 - Route C (Airport)
INSERT INTO buses (plate_number, capacity, route_id, current_lat, current_lng, speed, status) VALUES
('BUS-1003', 55, 3, 6.9300, 79.8700, 45.0, 'running');

-- Bus 4 - Route A
INSERT INTO buses (plate_number, capacity, route_id, current_lat, current_lng, speed, status) VALUES
('BUS-1004', 50, 1, 6.9100, 79.8450, 30.0, 'running');

-- Bus 5 - Route D (Idle)
INSERT INTO buses (plate_number, capacity, route_id, current_lat, current_lng, speed, status) VALUES
('BUS-1005', 40, 4, 6.9000, 79.8600, 0.0, 'idle');

-- Bus 6 - Route B (Maintenance)
INSERT INTO buses (plate_number, capacity, route_id, current_lat, current_lng, speed, status) VALUES
('BUS-1006', 45, 2, 6.9271, 79.8612, 0.0, 'maintenance');

-- Assign buses to drivers
UPDATE drivers SET assigned_bus_id = 1 WHERE id = 1;
UPDATE drivers SET assigned_bus_id = 2 WHERE id = 2;
UPDATE drivers SET assigned_bus_id = 3 WHERE id = 3;

-- Favorites for passengers
INSERT INTO favorites (user_id, bus_id) VALUES
(5, 1),
(5, 3),
(6, 2),
(6, 4);

-- Note: passwords above are placeholders. Use the register API to create users or replace with real bcrypt hashes.
-- Map initialization code in frontend/js/map.js has been enhanced with:
-- - Better route visualization with polylines
-- - Custom bus markers with status indicators
-- - Location popup information
-- - Route drawing functionality
-- - Marker management and map focusing
