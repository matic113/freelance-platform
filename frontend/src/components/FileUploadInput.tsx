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
  fullArea?: boolean;
  allowMultiple?: boolean;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  onFileSelect,
  isUploading = false,
  uploadProgress = 0,
  disabled = false,
  maxFileSizeMB = 10,
  acceptedFileTypes = '*',
  className,
  fullArea = false,
  allowMultiple = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  // Note: we do not maintain a persistent selected file name so multiple uploads are allowed

  const handleFileSelect = (file: File) => {
    const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      alert(`File size exceeds ${maxFileSizeMB}MB limit`);
      return;
    }

    onFileSelect(file);

    // clear the input so the same file can be selected again and multiple uploads can occur
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      handleFileSelect(files[i]);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Click handler for full area
  const handleAreaClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      // @ts-ignore stopPropagation exists on both mouse and keyboard events
      e.stopPropagation();
    }
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
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
        multiple={allowMultiple}
        className="hidden"
        aria-label="File upload"
      />

      {isUploading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">
            Uploading {uploadProgress}%
          </span>
        </div>
      ) : (
        // If fullArea is true, render a large clickable area instead of a small button
        fullArea ? (
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => handleAreaClick(e)}
            onKeyDown={(e) => {
              // Prevent Enter from submitting parent forms and stop propagation
              if (e.key === 'Enter' || e.key === ' ') {
                handleAreaClick(e);
              }
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-muted-foreground"
            title="Attach file"
          >
            <Paperclip className="h-6 w-6 mb-2" />
            <span className="text-sm">Click or drop files here to attach</span>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileInputRef.current?.click(); }}
            disabled={disabled || isUploading}
            className="h-8 w-8 p-0"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        )
      )}
    </div>
  );
};
