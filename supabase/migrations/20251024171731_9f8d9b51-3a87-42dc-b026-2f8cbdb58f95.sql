-- Create professionals table for fixers
CREATE TABLE public.professionals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialty text NOT NULL,
  bio text,
  hourly_rate numeric NOT NULL,
  service_zipcodes text[] NOT NULL DEFAULT '{}',
  phone text,
  avatar_url text,
  verified boolean DEFAULT false,
  is_sponsored boolean DEFAULT false,
  total_jobs integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating numeric NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Professionals policies
CREATE POLICY "Anyone can view professionals"
ON public.professionals FOR SELECT
USING (true);

CREATE POLICY "Users can create their own professional profile"
ON public.professionals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own professional profile"
ON public.professionals FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own professional profile"
ON public.professionals FOR DELETE
USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
ON public.reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON public.reviews FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_professionals_updated_at
BEFORE UPDATE ON public.professionals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate average rating
CREATE OR REPLACE FUNCTION public.get_professional_rating(professional_id uuid)
RETURNS TABLE (
  average_rating numeric,
  review_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(ROUND(AVG(rating), 1), 0) as average_rating,
    COUNT(*) as review_count
  FROM public.reviews
  WHERE reviews.professional_id = $1
$$;