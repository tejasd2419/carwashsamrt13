-- Fix vehicles table schema to match booking form expectations
ALTER TABLE vehicles ADD COLUMN vehicle_type VARCHAR(100) AFTER user_id;
ALTER TABLE vehicles ADD COLUMN registration_number VARCHAR(50) AFTER vehicle_type;
ALTER TABLE vehicles DROP COLUMN type;
ALTER TABLE vehicles DROP COLUMN model;
ALTER TABLE vehicles DROP COLUMN license_plate;
