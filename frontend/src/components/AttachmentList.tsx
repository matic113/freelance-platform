import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Trash2, Image, Archive, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projectService } from '@/services/project.service';

export interface AttachmentItem {
  id?: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt?: string;
}

interface AttachmentListProps {
  attachments: AttachmentItem[];
  onRemove?: (filename: string) => void;
  isRTL?: boolean;
  isRemoving?: boolean;
  canRemove?: boolean;
  deletedIds?: Set<string>;
}

const getFileIcon = (contentType?: string) => {
  const type = contentType || '';
  if (type.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) 
    return <Archive className="h-4 w-4 text-orange-500" />;
  if (type.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
  return <File className="h-4 w-4 text-gray-500" />;
};

const getFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  onRemove,
  isRTL = false,
  isRemoving = false,
  canRemove = false,
  deletedIds = new Set(),
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (attachments.length === 0) {
    return (
      <div className={cn("text-center py-6 text-muted-foreground", isRTL && "rtl")}>
        {isRTL ? 'لا توجد مرفقات' : 'No attachments'}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", isRTL && "rtl")}>
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors",
            attachment.id && deletedIds.has(attachment.id) && "opacity-50 bg-red-50 border-red-200",
            isRTL && "flex-row-reverse"
          )}
        >
          <div className={cn("flex items-center gap-3 flex-1", isRTL && "flex-row-reverse")}>
            {getFileIcon(attachment.type)}
            <div className="flex-1">
              <p className="text-sm font-medium truncate text-foreground">
                {attachment.filename}
              </p>
              <p className="text-xs text-muted-foreground">
                {getFileSize(attachment.size)}
              </p>
            </div>
          </div>

          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <button
              type="button"
              onClick={async () => {
                try {
                  if (!attachment.url && attachment.id) {
                    setLoadingId(attachment.id);
                    const downloadUrl = await projectService.getAttachmentDownloadUrl(attachment.id);
                    window.open(downloadUrl, '_blank', 'noopener');
                    setLoadingId(null);
                    return;
                  }

                  // If url looks absolute, open directly
                  if (attachment.url && /^(http|https):\/\//.test(attachment.url)) {
                    window.open(attachment.url, '_blank', 'noopener');
                    return;
                  }

                  // Fallback: open as path
                  if (attachment.url) {
                    window.open(attachment.url, '_blank', 'noopener');
                    return;
                  }
                } catch (err) {
                  console.error('Failed to open attachment', err);
                  setLoadingId(null);
                }
              }}
              className="text-blue-600 hover:text-blue-700 p-1"
              title={isRTL ? 'تحميل' : 'Download'}
            >
              {loadingId === attachment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            </button>

             {canRemove && onRemove && (
               <Button
                 type="button"
                 variant="ghost"
                 size="sm"
                 onClick={() => onRemove(attachment.filename)}
                 disabled={isRemoving}
                 className="h-8 w-8 p-0 hover:bg-destructive/10"
                 title={isRTL ? 'حذف' : 'Remove'}
               >
                {isRemoving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-destructive" />
                )}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
