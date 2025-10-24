-- Add new status value to bookings status check constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'completed', 'confirmed_completed', 'cancelled'));