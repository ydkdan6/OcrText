/*
  # Create OCR application tables

  1. New Tables
    - `ocr_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `image_url` (text)
      - `extracted_text` (text)
      - `file_name` (text, nullable)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `ocr_results` table
    - Add policies for authenticated users to:
      - Select their own results
      - Insert their own results
*/

-- Create the ocr_results table
CREATE TABLE IF NOT EXISTS ocr_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  image_url text NOT NULL,
  extracted_text text NOT NULL,
  file_name text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE ocr_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own results"
  ON ocr_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results"
  ON ocr_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);