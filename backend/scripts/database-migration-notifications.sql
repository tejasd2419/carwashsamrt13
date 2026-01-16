-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  booking_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  email_sent TINYINT DEFAULT 0,
  sms_sent TINYINT DEFAULT 0,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_booking_id (booking_id),
  INDEX idx_created_at (created_at)
);

-- Create notification_history table
CREATE TABLE IF NOT EXISTS notification_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  notification_id INT NOT NULL,
  channel VARCHAR(20),
  recipient VARCHAR(255),
  delivery_status VARCHAR(20),
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
  INDEX idx_notification_id (notification_id)
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  email_notifications TINYINT DEFAULT 1,
  sms_notifications TINYINT DEFAULT 0,
  booking_confirmation TINYINT DEFAULT 1,
  booking_reminder TINYINT DEFAULT 1,
  booking_updates TINYINT DEFAULT 1,
  reminder_hours_before INT DEFAULT 24,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create booking_status_history table
CREATE TABLE IF NOT EXISTS booking_status_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_booking_id (booking_id),
  INDEX idx_updated_at (updated_at)
);

-- Add status_updated_at column to bookings table if it doesn't exist
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
