/**
 * File upload component with drag & drop functionality
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  Upload, 
  FileText, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  error: string | null;
}

export default function FileUpload({ onFileUpload, error }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /**
   * Handle file drop event
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  }, []);

  /**
   * Handle drag over event
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  /**
   * Handle drag leave event
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  /**
   * Handle file input change
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  /**
   * Submit selected file for analysis
   */
  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  /**
   * Clear selected file
   */
  const handleClear = () => {
    setSelectedFile(null);
  };

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className={`transition-all duration-200 ${
        isDragOver 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : selectedFile 
          ? 'border-green-500 bg-green-50'
          : 'border-dashed border-slate-300 hover:border-slate-400'
      }`}>
        <CardContent className="p-8">
          <div
            className="text-center space-y-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Upload Icon */}
            <div className="flex justify-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                isDragOver 
                  ? 'bg-blue-100' 
                  : selectedFile 
                  ? 'bg-green-100'
                  : 'bg-slate-100'
              }`}>
                {selectedFile ? (
                  <CheckCircle className={`h-10 w-10 ${
                    isDragOver ? 'text-blue-600' : 'text-green-600'
                  }`} />
                ) : (
                  <Upload className={`h-10 w-10 ${
                    isDragOver ? 'text-blue-600' : 'text-slate-600'
                  }`} />
                )}
              </div>
            </div>

            {/* Upload Text */}
            {selectedFile ? (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-700">
                  File Selected Successfully!
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-5 w-5 text-slate-600" />
                  <span className="font-medium text-slate-900">{selectedFile.name}</span>
                </div>
                <p className="text-sm text-slate-600">
                  Size: {formatFileSize(selectedFile.size)} • 
                  Type: {selectedFile.type || 'Unknown'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {isDragOver ? 'Drop your file here!' : 'Upload File for Analysis'}
                </h3>
                <p className="text-slate-600">
                  Drag & drop your file here, or click to browse
                </p>
                <p className="text-sm text-slate-500">
                  Supports: .js, .ts, .json, .csv, .xml, .txt, .md, .html, .css and more
                </p>
              </div>
            )}

            {/* File Input */}
            <div className="pt-4">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".js,.ts,.jsx,.tsx,.json,.csv,.xml,.txt,.md,.html,.css,.py,.java,.cpp,.c,.php,.rb,.go,.rs,.sql,.yml,.yaml"
              />
              <label htmlFor="file-upload">
                <Button
                  className={`cursor-pointer ${
                    selectedFile 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  size="lg"
                >
                  {selectedFile ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Change File
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {selectedFile && (
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleSubmit}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            <FileText className="h-5 w-5 mr-2" />
            Analyze File
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            size="lg"
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Smart Detection</h4>
          <p className="text-sm text-slate-600">
            Automatically detects file type and analyzes structure, syntax, and content quality.
          </p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Issue Identification</h4>
          <p className="text-sm text-slate-600">
            Finds potential problems, security risks, and performance bottlenecks in your files.
          </p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Upload className="h-6 w-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Smart Recommendations</h4>
          <p className="text-sm text-slate-600">
            Provides actionable suggestions to improve code quality, security, and performance.
          </p>
        </div>
      </div>
    </div>
  );
}
