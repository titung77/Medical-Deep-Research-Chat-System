import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { fileService } from '../services/api';
import { 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Props {
  onUploadComplete?: () => void;
}

interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

const FileUpload: React.FC<Props> = ({ onUploadComplete }) => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 50MB.`);
        continue;
      }

      // Add to upload list
      setUploads(prev => [...prev, {
        filename: file.name,
        progress: 0,
        status: 'uploading'
      }]);

      try {
        await fileService.uploadFile(file, (progress) => {
          setUploads(prev => prev.map(upload => 
            upload.filename === file.name 
              ? { ...upload, progress }
              : upload
          ));
        });

        // Mark as completed
        setUploads(prev => prev.map(upload => 
          upload.filename === file.name 
            ? { ...upload, status: 'completed', progress: 100 }
            : upload
        ));

        toast.success(`${file.name} uploaded successfully!`);
        
        // Call completion callback after a delay
        setTimeout(() => {
          onUploadComplete?.();
        }, 1500);

      } catch (error) {
        console.error('Upload error:', error);
        
        setUploads(prev => prev.map(upload => 
          upload.filename === file.name 
            ? { 
                ...upload, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Upload failed' 
              }
            : upload
        ));

        toast.error(`Failed to upload ${file.name}`);
      }
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/json': ['.json']
    },
    multiple: true
  });

  const removeUpload = (filename: string) => {
    setUploads(prev => prev.filter(upload => upload.filename !== filename));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-green-900">Upload Medical Documents</h3>
      
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-green-400 bg-green-50'
            : 'border-green-300 hover:border-green-400 hover:bg-green-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-green-400 mb-4" />
        
        {isDragActive ? (
          <p className="text-green-700">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-green-700 font-medium mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-green-600">
              Supports PDF, DOCX, TXT, JSON files (max 50MB each)
            </p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Upload Progress</h4>
          
          {uploads.map((upload) => (
            <div
              key={upload.filename}
              className="bg-white rounded-lg border border-gray-200 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {upload.filename}
                </span>
                
                <div className="flex items-center space-x-2">
                  {upload.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                  )}
                  
                  {upload.status === 'completed' && (
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  )}
                  
                  {upload.status === 'error' && (
                    <XCircleIcon className="h-4 w-4 text-red-500" />
                  )}
                  
                  <button
                    onClick={() => removeUpload(upload.filename)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Progress Bar */}
              {upload.status === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  ></div>
                </div>
              )}
              
              {/* Status Text */}
              <div className="mt-1 text-xs">
                {upload.status === 'uploading' && (
                  <span className="text-gray-600">Uploading... {upload.progress}%</span>
                )}
                
                {upload.status === 'completed' && (
                  <span className="text-green-600">✓ Uploaded and indexed successfully</span>
                )}
                
                {upload.status === 'error' && (
                  <span className="text-red-600">✗ {upload.error || 'Upload failed'}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Upload Guidelines:</p>
            <ul className="space-y-1 text-xs">
              <li>• Medical documents will be processed and indexed for search</li>
              <li>• Supported formats: PDF, DOCX, TXT, JSON</li>
              <li>• Maximum file size: 50MB per file</li>
              <li>• Processing may take a few minutes for large documents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
