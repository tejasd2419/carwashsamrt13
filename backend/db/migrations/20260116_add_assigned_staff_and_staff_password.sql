ALTER TABLE bookings
  ADD COLUMN assigned_staff_id INT NULL,
  ADD CONSTRAINT fk_bookings_assigned_staff
    FOREIGN KEY (assigned_staff_id) REFERENCES staff(id) ON DELETE SET NULL;

ALTER TABLE staff
  ADD COLUMN password VARCHAR(255) NULL;