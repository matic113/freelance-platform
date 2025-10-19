import React from 'react';
import { Download, FileText, Image as ImageIcon, Archive, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileAttachmentPreviewProps {
  objectName: string;
  originalFileName: string;
  downloadUrl: string;
  fileSize: number;
  contentType: string;
  className?: string;
}

const getFileIcon = (contentType: string) => {
  if (contentType.startsWith('image/')) {
    return <ImageIcon className="h-4 w-4" />;
  }
  if (contentType.includes('pdf') || contentType.includes('document')) {
    return <FileText className="h-4 w-4" />;
  }
  if (contentType.includes('zip') || contentType.includes('archive') || contentType.includes('rar')) {
    return <Archive className="h-4 w-4" />;
  }
  return <File className="h-4 w-4" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const isImageFile = (contentType: string): boolean => {
  return contentType.startsWith('image/');
};

export const FileAttachmentPreview: React.FC<FileAttachmentPreviewProps> = ({
  objectName,
  originalFileName,
  downloadUrl,
  fileSize,
  contentType,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {isImageFile(contentType) ? (
        <div className="relative group">
          <img
            src={downloadUrl}
            alt={originalFileName}
            className="max-w-xs max-h-64 rounded-lg border border-muted-foreground/20"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <a href={downloadUrl} download={originalFileName} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-1" />
              Download
            </a>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted-foreground/20">
          <div className="flex-shrink-0">
            {getFileIcon(contentType)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" title={originalFileName}>
              {originalFileName}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(fileSize)}
            </p>
          </div>
          <Button
            asChild
            size="sm"
            variant="default"
          >
            <a href={downloadUrl} download={originalFileName} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};
