-- MySQL schema for Online Bus Tracking System

CREATE DATABASE IF NOT EXISTS online_bus_tracking;
USE online_bus_tracking;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  user_id INT,
  assigned_bus_id INT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  waypoints TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE buses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plate_number VARCHAR(50) NOT NULL UNIQUE,
  capacity INT DEFAULT 40,
  current_lat DOUBLE,
  current_lng DOUBLE,
  speed DOUBLE,
  status VARCHAR(30) DEFAULT 'idle',
  route_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL
);

CREATE TABLE trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bus_id INT,
  driver_id INT,
  started_at DATETIME,
  ended_at DATETIME,
  distance_m DOUBLE,
  avg_speed DOUBLE,
  events TEXT,
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE SET NULL,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  bus_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- indexes
CREATE INDEX idx_buses_route ON buses(route_id);
CREATE INDEX idx_drivers_bus ON drivers(assigned_bus_id);
