import { useState } from 'react';
import { fileUploadService, FileUploadResponse } from '@/services/fileUpload.service';
import { useToast } from '@/hooks/use-toast';

interface UseFileUploadOptions {
  maxFileSizeMB?: number;
  allowedTypes?: string[];
  onSuccess?: (file: FileUploadResponse) => void;
  onError?: (error: string) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const { maxFileSizeMB = 10, allowedTypes = [] } = options;
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (conversationId: string, file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      if (!fileUploadService.validateFileSize(file, maxFileSizeMB)) {
        throw new Error(
          `File size exceeds ${maxFileSizeMB}MB limit. Your file is ${fileUploadService.getFileSizeInMB(file.size)}MB`
        );
      }

      if (allowedTypes.length > 0 && !fileUploadService.validateFileType(file, allowedTypes)) {
        throw new Error(
          `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
        );
      }

      setUploadProgress(30);

      const response = await fileUploadService.uploadFileToConversation(
        conversationId,
        file
      );

      setUploadProgress(100);

      toast({
        title: 'Success',
        description: `File ${file.name} uploaded successfully`,
      });

      options.onSuccess?.(response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      options.onError?.(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadImage = async (conversationId: string, file: File) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return uploadFile(conversationId, file);
  };

  const uploadDocument = async (conversationId: string, file: File) => {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    return uploadFile(conversationId, file);
  };

  return {
    uploadFile,
    uploadImage,
    uploadDocument,
    isUploading,
    uploadProgress,
  };
};
