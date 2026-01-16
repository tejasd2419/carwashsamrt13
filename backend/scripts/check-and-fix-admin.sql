-- Check if admin user exists
SELECT id, email, role, password FROM users WHERE email = 'admin@sparklewash.com';

-- If admin doesn't exist or password is wrong, run this:
DELETE FROM users WHERE email = 'admin@sparklewash.com';

-- Insert admin with CORRECT password hash for "admin123"
INSERT INTO users (name, email, phone, password, role) VALUES 
('Admin User', 'admin@sparklewash.com', '9876543210', '$2b$10$LQZQT/AYZJ.6AdrZ8QHaWe3KQRwZOCBGdVPKScC1tCxFsHW5LQ9pG', 'admin');

-- Verify admin was created
SELECT id, email, role FROM users WHERE email = 'admin@sparklewash.com';
