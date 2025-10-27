-- Remove DB trigger approach to avoid RLS conflicts and double notifications
DROP TRIGGER IF EXISTS trg_notify_customer_on_quote_response ON public.quote_responses;
DROP FUNCTION IF EXISTS public.notify_customer_on_quote_response();