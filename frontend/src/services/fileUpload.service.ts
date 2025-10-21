import { apiService } from './api';

export interface FileUploadResponse {
  objectName: string;
  originalFileName: string;
  downloadUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
  folder: string;
}

export interface AttachmentData {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export const fileUploadService = {
  uploadFileToConversation: async (
    conversationId: string,
    file: File,
    folder: string = 'messages'
  ): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return apiService.post<FileUploadResponse>(
      `/conversations/${conversationId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  uploadImageToConversation: async (
    conversationId: string,
    file: File
  ): Promise<FileUploadResponse> => {
    return fileUploadService.uploadFileToConversation(conversationId, file, 'images');
  },

  uploadDocumentToConversation: async (
    conversationId: string,
    file: File
  ): Promise<FileUploadResponse> => {
    return fileUploadService.uploadFileToConversation(conversationId, file, 'documents');
  },

  uploadFileToProject: async (
    projectId: string,
    file: File,
    folder: string = 'files'
  ): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return apiService.post<FileUploadResponse>(
      `/projects/${projectId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  uploadImageToProject: async (
    projectId: string,
    file: File
  ): Promise<FileUploadResponse> => {
    return fileUploadService.uploadFileToProject(projectId, file, 'images');
  },

  uploadDocumentToProject: async (
    projectId: string,
    file: File
  ): Promise<FileUploadResponse> => {
    return fileUploadService.uploadFileToProject(projectId, file, 'documents');
  },

  validateFileSize: (file: File, maxSizeMB: number = 10): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  validateFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },

  getFileSizeInMB: (bytes: number): number => {
    return Math.round((bytes / 1024 / 1024) * 100) / 100;
  },

  getFileExtension: (fileName: string): string => {
    return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
  },

  isImageFile: (file: File): boolean => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(file.type);
  },

  isDocumentFile: (file: File): boolean => {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/rtf',
    ];
    return documentTypes.includes(file.type);
  },

  isArchiveFile: (file: File): boolean => {
    const archiveTypes = [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
    ];
    return archiveTypes.includes(file.type);
  },

  toAttachmentData: (response: FileUploadResponse): AttachmentData => {
    return {
      url: response.downloadUrl,
      filename: response.originalFileName,
      size: response.fileSize,
      type: response.contentType,
    };
  },
};

export interface PresignedUploadResponse {
  uploadUrl: string;
  objectName: string;
  filename: string;
  expirationMs: number;
}

export interface CompleteUploadRequest {
  objectName: string;
  filename: string;
  fileSize: number;
  contentType: string;
  folder: string;
}

export const presignedUploadService = {
  getPresignedUploadUrl: async (
    projectId: string,
    filename: string,
    folder: string = 'files'
  ): Promise<PresignedUploadResponse> => {
    return apiService.post<PresignedUploadResponse>(
      `/projects/${projectId}/presigned-upload`,
      null,
      {
        params: {
          filename,
          folder,
        },
      }
    );
  },

  uploadToPresignedUrl: async (
    uploadUrl: string,
    file: File
  ): Promise<void> => {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }
  },

  completeUpload: async (
    projectId: string,
    request: CompleteUploadRequest
  ): Promise<any> => {
    return apiService.post(`/projects/${projectId}/complete-upload`, request);
  },
};
