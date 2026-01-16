-- SparkleWash Database Setup Script
-- Drop entire database and recreate fresh

-- Step 1: Drop the entire database
DROP DATABASE IF EXISTS sparkle_wash;

-- Step 2: Create fresh database
CREATE DATABASE sparkle_wash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Step 3: Use the database
USE sparkle_wash;

-- Step 4: Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 5: Create services table
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration INT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 6: Create staff table
CREATE TABLE staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  position VARCHAR(100),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 7: Create vehicles table
CREATE TABLE vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vehicle_type VARCHAR(100) NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 8: Create bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  service_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
  notes TEXT,
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_service_id (service_id),
  INDEX idx_vehicle_id (vehicle_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 9: Insert sample services
INSERT INTO services (name, description, price, duration, image_url) VALUES
('Basic Wash', 'Standard car wash with soap and water', 500, 30, '/car-exterior-wash-with-soap-bubbles.jpg'),
('Premium Wash', 'Includes interior vacuuming and wax coating', 1000, 45, '/premium-car-wash-interior-cleaning.jpg'),
('Deluxe Detailing', 'Complete detailing with wax polish and shine', 1500, 60, '/car-detailing-wax-polish-shine.jpg'),
('Express Wash', 'Quick 15-minute wash service', 300, 15, '/quick-express-car-wash.jpg');

-- Step 10: Insert admin user (password: admin123)
INSERT INTO users (name, email, phone, password, role) VALUES 
('Admin User', 'admin@sparklewash.com', '9876543210', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/R1i', 'admin');

-- Step 11: Insert sample staff
INSERT INTO staff (name, email, phone, position, status) VALUES
('Raj Kumar', 'raj@sparklewash.com', '9123456789', 'Wash Technician', 'Active'),
('Priya Singh', 'priya@sparklewash.com', '9987654321', 'Supervisor', 'Active'),
('Amit Patel', 'amit@sparklewash.com', '9654321098', 'Manager', 'Active');

-- Step 12: Verify tables created
SHOW TABLES;

-- Done!
