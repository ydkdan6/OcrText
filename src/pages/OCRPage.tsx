import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { processImageFile, processImageUrl, downloadTextAsFile } from '../services/ocrService';
import { FileUp, Link as LinkIcon, Download, Loader, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const OCRPage: React.FC = () => {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return;
    
    const file = acceptedFiles[0];
    if (!file) return;
    
    setFileName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
    setLoading(true);
    setError(null);
    
    try {
      const result = await processImageFile(file, user.id);
      setExtractedText(result.extracted_text);
      toast.success('Text extracted successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to extract text');
      toast.error(error.message || 'Failed to extract text');
      console.error('Error processing image:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1
  });

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!imageUrl) {
      toast.error('Please enter an image URL');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await processImageUrl(imageUrl, user.id);
      setExtractedText(result.extracted_text);
      setFileName('image-from-url');
      toast.success('Text extracted successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to extract text');
      toast.error(error.message || 'Failed to extract text');
      console.error('Error processing image URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!extractedText) {
      toast.error('No text to download');
      return;
    }
    
    downloadTextAsFile(extractedText, fileName || 'extracted-text');
    toast.success('Text downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Extract Text from Images</h1>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
                
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag & drop an image here, or click to select
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports PNG, JPG, JPEG, GIF, BMP, WEBP
                  </p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Or use an image URL</h3>
                  <form onSubmit={handleUrlSubmit} className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Extract
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Results Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Extracted Text</h2>
                  {extractedText && (
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  )}
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
                    <p className="mt-2 text-sm text-gray-600">Processing image...</p>
                  </div>
                ) : (
                  <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Extracted text will appear here..."
                    readOnly={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCRPage;