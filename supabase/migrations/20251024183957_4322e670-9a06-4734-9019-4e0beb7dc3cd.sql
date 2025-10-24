-- Create storage bucket for message attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', true);

-- Add attachment fields to messages table
ALTER TABLE public.messages
ADD COLUMN attachment_url text,
ADD COLUMN attachment_type text;

-- Storage policies for message attachments
CREATE POLICY "Users can upload their own message attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view message attachments"
ON storage.objects
FOR SELECT
USING (bucket_id = 'message-attachments');

CREATE POLICY "Users can delete their own message attachments"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);