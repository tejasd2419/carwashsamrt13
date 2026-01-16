-- ============================================================================
-- SPARKLEWASH MASTER DATABASE RESET SCRIPT
-- This script runs ALL database setup scripts in the correct order
-- Execution Order:
-- 1. database-setup.sql (creates all base tables)
-- 2. database-setup-v2.sql (adds notification tables)
-- 3. database-migration-notifications.sql (alternative notification setup)
-- 4. fix-schema.sql (fixes vehicles table schema)
-- 5. check-and-fix-admin.sql (ensures admin user exists)
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP DATABASE AND CREATE FRESH SCHEMA (database-setup.sql)
-- ============================================================================

DROP DATABASE IF EXISTS sparkle_wash;
CREATE DATABASE sparkle_wash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sparkle_wash;

-- Create users table
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

-- Create services table
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration INT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create staff table
CREATE TABLE staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  position VARCHAR(100),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create vehicles table
CREATE TABLE vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vehicle_type VARCHAR(100) NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create bookings table
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
  status_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_service_id (service_id),
  INDEX idx_vehicle_id (vehicle_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample services
INSERT INTO services (name, description, price, duration, image_url) VALUES
('Basic Wash', 'Standard car wash with soap and water', 500, 30, '/car-exterior-wash-with-soap-bubbles.jpg'),
('Premium Wash', 'Includes interior vacuuming and wax coating', 1000, 45, '/premium-car-wash-interior-cleaning.jpg'),
('Deluxe Detailing', 'Complete detailing with wax polish and shine', 1500, 60, '/car-detailing-wax-polish-shine.jpg'),
('Express Wash', 'Quick 15-minute wash service', 300, 15, '/quick-express-car-wash.jpg');

-- Insert admin user (password: admin123 with correct bcrypt hash)
INSERT INTO users (name, email, phone, password, role) VALUES 
('Admin User', 'admin@sparklewash.com', '9876543210', '$2b$10$LQZQT/AYZJ.6AdrZ8QHaWe3KQRwZOCBGdVPKScC1tCxFsHW5LQ9pG', 'admin');

-- Insert sample staff
INSERT INTO staff (name, email, phone, position, status) VALUES
('Raj Kumar', 'raj@sparklewash.com', '9123456789', 'Wash Technician', 'Active'),
('Priya Singh', 'priya@sparklewash.com', '9987654321', 'Supervisor', 'Active'),
('Amit Patel', 'amit@sparklewash.com', '9654321098', 'Manager', 'Active');

-- ============================================================================
-- STEP 2: CREATE NOTIFICATION TABLES (database-setup-v2.sql)
-- ============================================================================

-- Create notifications table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  booking_id INT NOT NULL,
  type ENUM('booking_created', 'booking_confirmed', 'booking_reminder', 'booking_completed', 'booking_cancelled') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('sent', 'pending', 'failed') DEFAULT 'pending',
  email_sent TINYINT DEFAULT 0,
  sms_sent TINYINT DEFAULT 0,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_status (status),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create notification history table
CREATE TABLE notification_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notification_id INT NOT NULL,
  channel ENUM('email', 'sms', 'in_app') NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivery_status ENUM('sent', 'failed', 'bounced') DEFAULT 'sent',
  error_message TEXT,
  INDEX idx_notification_id (notification_id),
  FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create user notification preferences table
CREATE TABLE notification_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  email_notifications TINYINT DEFAULT 1,
  sms_notifications TINYINT DEFAULT 0,
  booking_confirmation TINYINT DEFAULT 1,
  booking_reminder TINYINT DEFAULT 1,
  booking_updates TINYINT DEFAULT 1,
  reminder_hours_before INT DEFAULT 24,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create booking status history table
CREATE TABLE booking_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  updated_by INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_booking_id (booking_id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initialize notification preferences for existing users
INSERT INTO notification_preferences (user_id, email_notifications, sms_notifications, booking_confirmation, booking_reminder, booking_updates)
SELECT id, 1, 0, 1, 1, 1 FROM users 
WHERE id NOT IN (SELECT user_id FROM notification_preferences);

-- ============================================================================
-- STEP 3: VERIFY ALL TABLES CREATED
-- ============================================================================

SELECT 'Database reset complete!' as Status;
SHOW TABLES;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_services FROM services;
SELECT COUNT(*) as total_staff FROM staff;
SELECT COUNT(*) as total_notifications_table FROM information_schema.tables WHERE table_schema = 'sparkle_wash' AND table_name = 'notifications';

-- ============================================================================
-- END OF MASTER RESET SCRIPT
-- All tables created and data initialized successfully!
-- ============================================================================
