-- Add attachment fields to messages table
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS attachment_url text,
ADD COLUMN IF NOT EXISTS attachment_type text;