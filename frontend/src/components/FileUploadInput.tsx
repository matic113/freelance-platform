import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadInputProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  disabled?: boolean;
  maxFileSizeMB?: number;
  acceptedFileTypes?: string;
  className?: string;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  onFileSelect,
  isUploading = false,
  uploadProgress = 0,
  disabled = false,
  maxFileSizeMB = 10,
  acceptedFileTypes = '*',
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      alert(`File size exceeds ${maxFileSizeMB}MB limit`);
      return;
    }

    setSelectedFileName(file.name);
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={cn(
        'relative group',
        dragActive && 'ring-2 ring-primary rounded-lg',
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        accept={acceptedFileTypes}
        className="hidden"
        aria-label="File upload"
      />

      {selectedFileName && !isUploading ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
            {selectedFileName}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : isUploading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">
            Uploading {uploadProgress}%
          </span>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="h-8 w-8 p-0"
          title="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
