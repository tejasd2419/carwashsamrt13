-- SparkleWash Database Setup v2 - Adds Notifications
-- This script adds notification tables without dropping existing data

USE sparkle_wash;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
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

-- Create notification history table (for tracking sent notifications)
CREATE TABLE IF NOT EXISTS notification_history (
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
CREATE TABLE IF NOT EXISTS notification_preferences (
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

-- Add status history column to bookings if not exists
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create booking status history table
CREATE TABLE IF NOT EXISTS booking_status_history (
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

SHOW TABLES;
-- Done! All notification tables created.
