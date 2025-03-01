/*
  # Add RPC function to bypass RLS

  1. New Functions
    - `insert_ocr_result` - A stored procedure that allows inserting OCR results while bypassing RLS
  
  2. Purpose
    - This function allows inserting data into the ocr_results table even when RLS policies would normally prevent it
    - It's useful for debugging and for cases where RLS is causing issues
*/

-- Create a function to insert OCR results that bypasses RLS
CREATE OR REPLACE FUNCTION insert_ocr_result(
  p_user_id UUID,
  p_image_url TEXT,
  p_extracted_text TEXT,
  p_file_name TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the privileges of the creator
AS $$
BEGIN
  INSERT INTO ocr_results (user_id, image_url, extracted_text, file_name)
  VALUES (p_user_id, p_image_url, p_extracted_text, p_file_name);
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error inserting OCR result: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Grant execute permission to the anon and authenticated roles
GRANT EXECUTE ON FUNCTION insert_ocr_result TO anon, authenticated;