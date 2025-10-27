-- Create a trigger to notify customers when a quote response is inserted
CREATE OR REPLACE FUNCTION public.notify_customer_on_quote_response()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  req_record record;
BEGIN
  -- Fetch the related quote request to get customer info
  SELECT id, customer_id, service_category, zipcode
    INTO req_record
  FROM public.quote_requests
  WHERE id = NEW.quote_request_id;

  -- Create a notification for the customer
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

-- Attach the trigger to quote_responses inserts
DROP TRIGGER IF EXISTS trg_notify_customer_on_quote_response ON public.quote_responses;
CREATE TRIGGER trg_notify_customer_on_quote_response
AFTER INSERT ON public.quote_responses
FOR EACH ROW
EXECUTE FUNCTION public.notify_customer_on_quote_response();