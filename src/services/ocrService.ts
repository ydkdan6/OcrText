import { supabase } from '../supabase/config';
import { OCRResult } from '../types';

const OCR_API_KEY = import.meta.env.VITE_OCR_API_KEY;
const OCR_API_URL = 'https://api.ocr.space/parse/image';

export const processImageUrl = async (imageUrl: string, userId: string, fileName?: string): Promise<OCRResult> => {
  try {
    // Proceed with OCR processing
    const formData = new FormData();
    formData.append('apikey', OCR_API_KEY);
    formData.append('url', imageUrl);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');

    const response = await fetch(OCR_API_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!data.ParsedResults || data.ParsedResults.length === 0) {
      throw new Error('Failed to extract text from image');
    }

    const extractedText = data.ParsedResults[0].ParsedText;
    
    // Save result to Supabase with RLS bypass
    const { data: result, error } = await supabase
      .from('ocr_results')
      .insert([
        {
          user_id: userId,
          image_url: imageUrl,
          extracted_text: extractedText,
          file_name: fileName || null
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase insert error:', error);
      
      // Try direct SQL insert as a fallback (bypasses RLS)
      const { data: directResult, error: directError } = await supabase.rpc('insert_ocr_result', {
        p_user_id: userId,
        p_image_url: imageUrl,
        p_extracted_text: extractedText,
        p_file_name: fileName || null
      });
      
      if (directError) {
        console.error('Direct SQL insert error:', directError);
        throw new Error(`Database error: ${directError.message}`);
      }
      
      if (!directResult) {
        throw new Error('Failed to save OCR result');
      }
      
      // Fetch the inserted record
      const { data: fetchedResult, error: fetchError } = await supabase
        .from('ocr_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (fetchError) {
        throw new Error(`Failed to retrieve saved OCR result: ${fetchError.message}`);
      }
      
      return fetchedResult;
    }
    
    return result;
  } catch (error: any) {
    console.error('Error processing image:', error);
    throw error;
  }
};

export const processImageFile = async (file: File, userId: string): Promise<OCRResult> => {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `ocr-images/${fileName}`;
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ocr-images')
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600'
      });
      
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      
      // Try with a simpler path as fallback
      const simplePath = `${Date.now()}-${file.name}`;
      const { data: simpleUploadData, error: simpleUploadError } = await supabase.storage
        .from('ocr-images')
        .upload(simplePath, file, {
          upsert: true,
          cacheControl: '3600'
        });
        
      if (simpleUploadError) {
        throw new Error(`Storage error: ${simpleUploadError.message}`);
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('ocr-images')
        .getPublicUrl(simplePath);
      
      // Process the uploaded image URL
      return processImageUrl(publicUrl, userId, file.name);
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('ocr-images')
      .getPublicUrl(filePath);
    
    // Process the uploaded image URL
    return processImageUrl(publicUrl, userId, file.name);
  } catch (error) {
    console.error('Error processing image file:', error);
    throw error;
  }
};

export const getUserOCRResults = async (userId: string): Promise<OCRResult[]> => {
  try {
    const { data, error } = await supabase
      .from('ocr_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching OCR results:', error);
      return []; // Return empty array instead of throwing
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching OCR results:', error);
    return []; // Return empty array instead of throwing
  }
};

export const downloadTextAsFile = (text: string, fileName: string = 'extracted-text') => {
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `${fileName}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};