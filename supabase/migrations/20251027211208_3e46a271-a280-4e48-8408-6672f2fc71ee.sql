-- Add Stripe Connect account info to professionals table
ALTER TABLE professionals 
ADD COLUMN stripe_account_id text,
ADD COLUMN stripe_onboarding_complete boolean DEFAULT false;

-- Add payment tracking to bookings table
ALTER TABLE bookings
ADD COLUMN payment_intent_id text,
ADD COLUMN payment_status text DEFAULT 'unpaid',
ADD COLUMN amount numeric NOT NULL DEFAULT 0,
ADD COLUMN platform_fee numeric NOT NULL DEFAULT 0;

-- Update status to include payment-pending
COMMENT ON COLUMN bookings.payment_status IS 'Payment status: unpaid, pending, paid, refunded';

-- Create index for faster payment lookups
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_professionals_stripe_account ON professionals(stripe_account_id);