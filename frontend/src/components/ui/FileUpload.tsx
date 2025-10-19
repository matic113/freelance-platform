import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload, 
  X, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music, 
  Archive, 
  Download, 
  Eye, 
  Trash2, 
  Check, 
  AlertCircle, 
  Cloud, 
  CloudOff,
  RefreshCw,
  Plus,
  FolderOpen,
  Copy,
  Share2,
  MoreVertical,
  FileSpreadsheet,
  FileCode,
  FilePdf,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileType,
  FileCheck,
  FileX,
  FileWarning,
  FileMinus,
  FilePlus,
  FileEdit,
  FileSearch,
  FileSliders,
  FileStack,
  FileSymlink,
  FileUp,
  FileDown,
  FileInput,
  FileOutput,
  FileQuestion,
  FileSignature,
  FileTextIcon,
  FileVideo2,
  FileAudio2,
  FileImage2,
  FilePdf2,
  FileCode2,
  FileSpreadsheet2,
  FileArchive2,
  FileType2,
  FileCheck2,
  FileX2,
  FileWarning2,
  FileMinus2,
  FilePlus2,
  FileEdit2,
  FileSearch2,
  FileSliders2,
  FileStack2,
  FileSymlink2,
  FileUp2,
  FileDown2,
  FileInput2,
  FileOutput2,
  FileQuestion2,
  FileSignature2
} from 'lucide-react';

export interface FileUploadItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'cancelled';
  progress: number;
  error?: string;
  url?: string;
  thumbnail?: string;
  uploadedAt?: Date;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    pages?: number;
  };
}

export interface FileUploadConfig {
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
  multiple?: boolean;
  dragAndDrop?: boolean;
  showPreview?: boolean;
  showProgress?: boolean;
  autoUpload?: boolean;
  chunkSize?: number; // for large file uploads
  retryAttempts?: number;
  uploadEndpoint?: string;
  headers?: Record<string, string>;
}

interface FileUploadProps {
  config?: FileUploadConfig;
  files?: FileUploadItem[];
  onFilesChange?: (files: FileUploadItem[]) => void;
  onUpload?: (files: FileUploadItem[]) => Promise<void>;
  onRemove?: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
  className?: string;
  isRTL?: boolean;
  disabled?: boolean;
  placeholder?: string;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  config = {},
  files = [],
  onFilesChange,
  onUpload,
  onRemove,
  onRetry,
  className,
  isRTL = false,
  disabled = false,
  placeholder,
  accept
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileUploadItem | null>(null);

  const defaultConfig: Required<FileUploadConfig> = {
    maxFiles: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*', 'application/pdf', 'text/*', 'video/*', 'audio/*'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt', '.doc', '.docx', '.mp4', '.mp3'],
    multiple: true,
    dragAndDrop: true,
    showPreview: true,
    showProgress: true,
    autoUpload: false,
    chunkSize: 1024 * 1024, // 1MB
    retryAttempts: 3,
    uploadEndpoint: '/api/upload',
    headers: {}
  };

  const finalConfig = { ...defaultConfig, ...config };

  const getFileIcon = (fileType: string, fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-8 w-8 text-green-500" />;
    } else if (fileType.startsWith('video/')) {
      return <FileVideo className="h-8 w-8 text-purple-500" />;
    } else if (fileType.startsWith('audio/')) {
      return <FileAudio className="h-8 w-8 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <FilePdf className="h-8 w-8 text-red-500" />;
    } else if (fileType.includes('spreadsheet') || extension === 'xlsx' || extension === 'xls') {
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    } else if (fileType.includes('code') || extension === 'js' || extension === 'ts' || extension === 'html' || extension === 'css') {
      return <FileCode className="h-8 w-8 text-orange-500" />;
    } else if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) {
      return <FileArchive className="h-8 w-8 text-yellow-500" />;
    } else {
      return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > finalConfig.maxFileSize) {
      return isRTL 
        ? `حجم الملف كبير جداً. الحد الأقصى ${formatFileSize(finalConfig.maxFileSize)}`
        : `File size too large. Maximum ${formatFileSize(finalConfig.maxFileSize)}`;
    }

    // Check file type
    const isValidType = finalConfig.allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return isRTL 
        ? 'نوع الملف غير مدعوم'
        : 'File type not supported';
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (finalConfig.allowedExtensions.length > 0 && !finalConfig.allowedExtensions.includes(extension)) {
      return isRTL 
        ? 'امتداد الملف غير مدعوم'
        : 'File extension not supported';
    }

    return null;
  };

  const createFileItem = (file: File): FileUploadItem => {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
      uploadedAt: new Date()
    };
  };

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles: FileUploadItem[] = [];
    const errors: string[] = [];

    Array.from(selectedFiles).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        newFiles.push(createFileItem(file));
      }
    });

    if (errors.length > 0) {
      // Show error alert
      console.error('File validation errors:', errors);
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      onFilesChange?.(updatedFiles);

      if (finalConfig.autoUpload) {
        handleUpload(newFiles);
      }
    }
  }, [files, onFilesChange, finalConfig, isRTL]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && finalConfig.dragAndDrop) {
      setIsDragOver(true);
    }
  }, [disabled, finalConfig.dragAndDrop]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || !finalConfig.dragAndDrop) return;

    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [disabled, finalConfig.dragAndDrop, handleFileSelect]);

  const handleUpload = async (filesToUpload: FileUploadItem[] = files) => {
    if (!onUpload) return;

    setIsUploading(true);
    
    try {
      // Update file statuses to uploading
      const updatedFiles = filesToUpload.map(file => ({
        ...file,
        status: 'uploading' as const,
        progress: 0
      }));
      onFilesChange?.(updatedFiles);

      // Simulate upload progress
      for (const file of filesToUpload) {
        const fileIndex = updatedFiles.findIndex(f => f.id === file.id);
        if (fileIndex !== -1) {
          // Simulate progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            updatedFiles[fileIndex] = {
              ...updatedFiles[fileIndex],
              progress,
              status: progress === 100 ? 'completed' : 'uploading'
            };
            onFilesChange?.([...updatedFiles]);
          }
        }
      }

      await onUpload(updatedFiles);
    } catch (error) {
      // Handle upload error
      const updatedFiles = filesToUpload.map(file => ({
        ...file,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Upload failed'
      }));
      onFilesChange?.(updatedFiles);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (fileId: string) => {
    onRemove?.(fileId);
    onFilesChange?.(files.filter(f => f.id !== fileId));
  };

  const handleRetry = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      onRetry?.(fileId);
      handleUpload([file]);
    }
  };

  const handlePreview = (file: FileUploadItem) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  const getStatusIcon = (status: FileUploadItem['status']) => {
    switch (status) {
      case 'pending':
        return <File className="h-4 w-4 text-gray-500" />;
      case 'uploading':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-gray-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: FileUploadItem['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: FileUploadItem['status']) => {
    switch (status) {
      case 'pending':
        return isRTL ? 'في الانتظار' : 'Pending';
      case 'uploading':
        return isRTL ? 'جاري الرفع' : 'Uploading';
      case 'completed':
        return isRTL ? 'مكتمل' : 'Completed';
      case 'error':
        return isRTL ? 'خطأ' : 'Error';
      case 'cancelled':
        return isRTL ? 'ملغي' : 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isRTL ? "اسحب الملفات هنا أو" : "Drag files here or"}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isRTL ? "اختر الملفات" : "Choose Files"}
                </Button>
              </div>
              
              <p className="text-sm text-gray-500">
                {placeholder || (isRTL 
                  ? `الحد الأقصى ${finalConfig.maxFiles} ملفات، ${formatFileSize(finalConfig.maxFileSize)} لكل ملف`
                  : `Maximum ${finalConfig.maxFiles} files, ${formatFileSize(finalConfig.maxFileSize)} per file`
                )}
              </p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {finalConfig.allowedExtensions.map((ext, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {ext}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={finalConfig.multiple}
        accept={accept || finalConfig.allowedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileStack className="h-5 w-5" />
                {isRTL ? "الملفات المحددة" : "Selected Files"}
                <Badge variant="outline">{files.length}</Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                {!finalConfig.autoUpload && (
                  <Button
                    onClick={() => handleUpload()}
                    disabled={isUploading || files.every(f => f.status === 'completed')}
                    size="sm"
                  >
                    <Cloud className="h-4 w-4 mr-2" />
                    {isRTL ? "رفع الملفات" : "Upload Files"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => onFilesChange?.([])}
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isRTL ? "مسح الكل" : "Clear All"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type, file.name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </h4>
                      <Badge className={getStatusColor(file.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(file.status)}
                          {getStatusText(file.status)}
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.type}</span>
                      {file.uploadedAt && (
                        <span>{file.uploadedAt.toLocaleTimeString()}</span>
                      )}
                    </div>
                    
                    {file.error && (
                      <Alert className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {file.error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {finalConfig.showProgress && file.status === 'uploading' && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-2" />
                        <span className="text-xs text-gray-500 mt-1">
                          {file.progress}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {finalConfig.showPreview && file.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePreview(file)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {file.status === 'error' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRetry(file.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {isRTL ? "معاينة الملف" : "File Preview"}
            </DialogTitle>
          </DialogHeader>
          
          {previewFile && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {getFileIcon(previewFile.type, previewFile.name)}
                <div>
                  <h3 className="font-medium">{previewFile.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(previewFile.size)} • {previewFile.type}
                  </p>
                </div>
              </div>
              
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {isRTL ? "معاينة الملف غير متاحة" : "File preview not available"}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = previewFile.url || URL.createObjectURL(previewFile.file);
                    link.download = previewFile.name;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isRTL ? "تحميل الملف" : "Download File"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUpload;
