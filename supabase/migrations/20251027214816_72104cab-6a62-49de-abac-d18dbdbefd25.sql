-- Add status column to quote_responses to track accepted/declined quotes
ALTER TABLE public.quote_responses 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined'));

-- Create an index for faster status queries
CREATE INDEX IF NOT EXISTS idx_quote_responses_status ON public.quote_responses(status);