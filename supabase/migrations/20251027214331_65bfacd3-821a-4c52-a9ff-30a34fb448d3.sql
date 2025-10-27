-- Fix quote_responses insert policy to enforce per-request limit and professional check
DROP POLICY IF EXISTS "Professionals can create quote responses" ON public.quote_responses;
CREATE POLICY "Professionals can create quote responses"
ON public.quote_responses
FOR INSERT
WITH CHECK (
  -- user must own the professional profile used in the row
  auth.uid() IN (
    SELECT p.user_id FROM public.professionals p WHERE p.id = quote_responses.professional_id
  )
  AND
  -- enforce max 3 responses PER request
  (
    SELECT count(*) FROM public.quote_responses qr
    WHERE qr.quote_request_id = quote_responses.quote_request_id
  ) < 3
);

-- Recreate trigger to notify customers on new quote responses (idempotent)
CREATE OR REPLACE FUNCTION public.notify_customer_on_quote_response()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  req_record record;
BEGIN
  SELECT id, customer_id, service_category, zipcode
    INTO req_record
  FROM public.quote_requests
  WHERE id = NEW.quote_request_id;

  IF req_record.customer_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, link)
    VALUES (
      req_record.customer_id,
      'New Quote Received',
      format('You received a new quote for %s in %s.', COALESCE(req_record.service_category, 'your request'), COALESCE(req_record.zipcode, 'your area')),
      '/quote-request/' || req_record.id::text
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_customer_on_quote_response ON public.quote_responses;
CREATE TRIGGER trg_notify_customer_on_quote_response
AFTER INSERT ON public.quote_responses
FOR EACH ROW
EXECUTE FUNCTION public.notify_customer_on_quote_response();