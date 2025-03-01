/*
  # Create storage bucket for OCR images

  1. New Storage
    - Create a bucket named 'ocr-images' for storing uploaded images
  
  2. Security
    - Enable public access for reading images
    - Restrict uploads to authenticated users
*/

-- Create a storage bucket for OCR images
INSERT INTO storage.buckets (id, name, public)
VALUES ('ocr-images', 'ocr-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the bucket
CREATE POLICY "Public can view OCR images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'ocr-images');

CREATE POLICY "Authenticated users can upload OCR images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'ocr-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );