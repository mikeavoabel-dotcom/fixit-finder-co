-- Add timestamp for when quote was accepted
ALTER TABLE public.quote_responses 
ADD COLUMN IF NOT EXISTS accepted_at timestamp with time zone;

-- Update existing accepted quotes to have an accepted_at timestamp
UPDATE public.quote_responses 
SET accepted_at = created_at 
WHERE status = 'accepted' AND accepted_at IS NULL;

-- Create function to notify professional when their quote status changes
CREATE OR REPLACE FUNCTION public.notify_professional_on_quote_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  pro_user_id uuid;
  request_category text;
  status_message text;
BEGIN
  -- Only proceed if status changed to accepted or declined
  IF (TG_OP = 'UPDATE' AND OLD.status = 'pending' AND NEW.status IN ('accepted', 'declined')) THEN
    
    -- Get the professional's user_id
    SELECT user_id INTO pro_user_id
    FROM public.professionals
    WHERE id = NEW.professional_id;
    
    -- Get the request category
    SELECT service_category INTO request_category
    FROM public.quote_requests
    WHERE id = NEW.quote_request_id;
    
    -- Set message based on status
    IF NEW.status = 'accepted' THEN
      status_message := format('Your quote for %s was accepted! You have 10 minutes to respond.', COALESCE(request_category, 'the project'));
    ELSE
      status_message := format('Your quote for %s was declined.', COALESCE(request_category, 'the project'));
    END IF;
    
    -- Create notification
    INSERT INTO public.notifications (user_id, title, message, link)
    VALUES (
      pro_user_id,
      CASE WHEN NEW.status = 'accepted' THEN 'Quote Accepted! ⏰' ELSE 'Quote Declined' END,
      status_message,
      '/quote-request/' || NEW.quote_request_id::text
    );
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Attach trigger for quote status changes
DROP TRIGGER IF EXISTS trg_notify_professional_on_quote_status_change ON public.quote_responses;
CREATE TRIGGER trg_notify_professional_on_quote_status_change
AFTER UPDATE ON public.quote_responses
FOR EACH ROW
EXECUTE FUNCTION public.notify_professional_on_quote_status_change();

-- Create function to check for expired accepted quotes and notify customers
CREATE OR REPLACE FUNCTION public.check_expired_quote_acceptances()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  expired_quote record;
  customer_id_val uuid;
  request_category text;
BEGIN
  -- Find quotes that were accepted more than 10 minutes ago and haven't been responded to
  FOR expired_quote IN 
    SELECT qr.id, qr.quote_request_id, qr.accepted_at
    FROM public.quote_responses qr
    WHERE qr.status = 'accepted' 
      AND qr.accepted_at IS NOT NULL
      AND qr.accepted_at < NOW() - INTERVAL '10 minutes'
      -- Check if there's no message from the professional in the last 10 minutes
      AND NOT EXISTS (
        SELECT 1 FROM public.messages m
        INNER JOIN public.professionals p ON m.sender_id = p.user_id
        WHERE p.id = qr.professional_id
          AND m.created_at > qr.accepted_at
      )
  LOOP
    -- Get customer_id and category
    SELECT customer_id, service_category 
    INTO customer_id_val, request_category
    FROM public.quote_requests
    WHERE id = expired_quote.quote_request_id;
    
    -- Mark quote as expired (change to declined)
    UPDATE public.quote_responses 
    SET status = 'declined'
    WHERE id = expired_quote.id;
    
    -- Notify customer to request another quote
    INSERT INTO public.notifications (user_id, title, message, link)
    VALUES (
      customer_id_val,
      'Quote Expired',
      format('The accepted quote for %s expired. Request another quote to find available professionals.', COALESCE(request_category, 'your project')),
      '/get-quotes'
    );
    
  END LOOP;
END;
$$;