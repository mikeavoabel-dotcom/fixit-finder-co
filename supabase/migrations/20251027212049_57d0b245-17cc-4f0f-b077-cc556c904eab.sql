-- Create quotes table to track quote requests and responses
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  service_category TEXT NOT NULL,
  project_description TEXT NOT NULL,
  zipcode TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  timeline TEXT NOT NULL,
  budget TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.quote_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_request_id UUID NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  quote_amount NUMERIC NOT NULL,
  quote_details TEXT,
  response_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(quote_request_id, professional_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quote_requests
CREATE POLICY "Users can view their own quote requests" ON public.quote_requests
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Authenticated users can create quote requests" ON public.quote_requests
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- RLS Policies for quote_responses
CREATE POLICY "Anyone can view quote responses" ON public.quote_responses
  FOR SELECT USING (true);

CREATE POLICY "Professionals can create quote responses" ON public.quote_responses
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM professionals WHERE id = professional_id)
    AND (SELECT COUNT(*) FROM quote_responses WHERE quote_request_id = quote_responses.quote_request_id) < 3
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_quote_requests_customer ON quote_requests(customer_id);
CREATE INDEX idx_quote_requests_category ON quote_requests(service_category);
CREATE INDEX idx_quote_responses_quote_request ON quote_responses(quote_request_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);