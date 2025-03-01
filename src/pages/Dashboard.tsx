import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOCRResults, downloadTextAsFile } from '../services/ocrService';
import { OCRResult } from '../types';
import { Download, Clock, FileText, Image } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<OCRResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<OCRResult | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      
      try {
        const data = await getUserOCRResults(user.id);
        setResults(data);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to load your extraction history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [user]);

  const handleDownload = (result: OCRResult) => {
    const fileName = result.file_name || 'extracted-text';
    downloadTextAsFile(result.extracted_text, fileName);
    toast.success('Text downloaded successfully!');
  };

  const handleResultClick = (result: OCRResult) => {
    setSelectedResult(result);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Extraction History</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No extractions yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start extracting text from images to build your history.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Results List */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Extractions
                  </h3>
                </div>
                <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {results.map((result) => (
                    <li 
                      key={result.id}
                      className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                        selectedResult?.id === result.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Image className="h-10 w-10 rounded-full bg-indigo-100 p-2 text-indigo-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                              {result.file_name || 'Extracted Text'}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="flex-shrink-0 mr-1 h-3 w-3" />
                              {formatDate(result.created_at)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(result);
                          }}
                          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Result Detail */}
            <div className="lg:col-span-2">
              {selectedResult ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedResult.file_name || 'Extracted Text'}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {formatDate(selectedResult.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(selectedResult)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Image</h4>
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                        <img 
                          src={selectedResult.image_url} 
                          alt="Extracted from" 
                          className="w-full h-auto max-h-[300px] object-contain bg-gray-100"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Extracted Text</h4>
                      <div className="border border-gray-200 rounded-md p-3 bg-gray-50 max-h-[300px] overflow-y-auto">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                          {selectedResult.extracted_text || 'No text extracted'}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-8 text-center h-full flex flex-col justify-center items-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Select an extraction</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Click on an extraction from the list to view details.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;