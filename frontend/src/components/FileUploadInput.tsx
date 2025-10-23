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
    const fileList = e.target.files;
    console.log('[FileUploadInput] handleInputChange called. Files count:', fileList?.length);
    if (!fileList || fileList.length === 0) return;
    
    // Convert FileList to array to avoid issues with live collection
    const filesArray = Array.from(fileList);
    console.log('[FileUploadInput] Processing', filesArray.length, 'files');
    
    for (let i = 0; i < filesArray.length; i++) {
      console.log('[FileUploadInput] Calling handleFileSelect for file', i, ':', filesArray[i].name);
      handleFileSelect(filesArray[i]);
    }
    console.log('[FileUploadInput] All files processed, clearing input');
    // Clear input for next upload
    if (e.target) {
      e.target.value = '';
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        handleFileSelect(e.dataTransfer.files[i]);
      }
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
         fullArea ? 'relative w-full h-full' : 'relative group',
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
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">
                {uploadProgress > 0 ? `${uploadProgress}%` : 'Uploading...'}
              </span>
            </div>
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
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-muted-foreground rounded-lg"
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
