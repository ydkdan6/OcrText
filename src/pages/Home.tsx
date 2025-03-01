import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, Database, Lock } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Extract Text from Images with OCRly
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl">
              Our powerful OCR technology converts images to editable text in seconds. 
              Upload an image or provide a URL and get accurate text extraction instantly.
            </p>
            <div className="mt-10">
              {user ? (
                <Link
                  to="/ocr"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Start Extracting Text
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Sign Up for Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Powerful OCR Features
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to extract and manage text from images.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mx-auto">
                  <Upload size={24} />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">Image Upload</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Upload images from your device or provide an image URL for processing.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mx-auto">
                  <FileText size={24} />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">Text Extraction</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Advanced OCR technology extracts text with high accuracy from various image formats.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mx-auto">
                  <Database size={24} />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">History Dashboard</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Access all your past extractions from a convenient dashboard interface.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mx-auto">
                  <Lock size={24} />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">Secure Authentication</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Your data is protected with secure user authentication and storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-200">Start extracting text today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            {user ? (
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/ocr"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Go to OCR Tool
                </Link>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-md shadow">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                  >
                    Sign Up
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Log In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;