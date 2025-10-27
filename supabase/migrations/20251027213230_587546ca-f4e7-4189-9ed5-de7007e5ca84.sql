-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own quote requests" ON public.quote_requests;

-- Create a new policy that allows both customers and professionals to view quote requests
CREATE POLICY "Customers and professionals can view quote requests"
ON public.quote_requests
FOR SELECT
USING (
  auth.uid() = customer_id 
  OR 
  auth.uid() IN (
    SELECT user_id FROM public.professionals
  )
);