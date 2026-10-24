'use client';

import { Attachment } from '@/types/chat';
import {
  FileText,
  FileCode,
  Image as ImageIcon,
  FileSpreadsheet,
  File,
  X,
} from 'lucide-react';
import { escapeRegExp } from '@/lib/searchMessages';
import { cn } from '@/lib/utils';

interface AttachmentChipProps {
  attachment: Attachment;
  onRemove?: (id: string) => void;
  readOnly?: boolean;
  className?: string;
  searchQuery?: string;
  activeMatchIndex?: number;
  getAttachmentMatchIndex?: () => number;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(filename: string, mimeType?: string) {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    return <FileText className="h-3.5 w-3.5 text-rose-500 shrink-0" />;
  }
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || mimeType?.startsWith('image/')) {
    return <ImageIcon className="h-3.5 w-3.5 text-blue-500 shrink-0" />;
  }
  if (ext === 'json' || ext === 'md') {
    return <FileCode className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
  }
  if (ext === 'docx' || ext === 'doc' || ext === 'txt') {
    return <FileText className="h-3.5 w-3.5 text-emerald-500 shrink-0" />;
  }
  if (ext === 'csv' || ext === 'xlsx') {
    return <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 shrink-0" />;
  }
  return <File className="h-3.5 w-3.5 text-zinc-500 shrink-0" />;
}

export function AttachmentChip({
  attachment,
  onRemove,
  readOnly = false,
  className,
  searchQuery,
  activeMatchIndex,
  getAttachmentMatchIndex,
}: AttachmentChipProps) {
  const renderName = () => {
    const trimmed = searchQuery?.trim();
    if (!trimmed || !getAttachmentMatchIndex || !attachment.name.toLowerCase().includes(trimmed.toLowerCase())) {
      return attachment.name;
    }

    const regex = new RegExp(`(${escapeRegExp(trimmed)})`, 'gi');
    const parts = attachment.name.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === trimmed.toLowerCase()) {
        const matchIdx = getAttachmentMatchIndex();
        const isActive = matchIdx === activeMatchIndex;
        return (
          <mark
            key={index}
            id={`search-match-${matchIdx}`}
            data-search-match-index={matchIdx}
            className={cn(
              'rounded-2xs px-0.5 transition-colors',
              isActive
                ? 'bg-amber-400 text-zinc-950 font-semibold ring-2 ring-amber-500/80 dark:bg-amber-400 dark:text-zinc-950'
                : 'bg-yellow-200/80 text-zinc-900 dark:bg-amber-500/30 dark:text-amber-200'
            )}
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all shadow-2xs select-none',
        readOnly
          ? 'bg-zinc-100/90 border-zinc-200 text-zinc-800 dark:bg-zinc-800/80 dark:border-zinc-700 dark:text-zinc-200'
          : 'bg-white border-zinc-200/90 text-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700',
        className
      )}
    >
      {getFileIcon(attachment.name, attachment.type)}

      <span
        title={attachment.name}
        className="max-w-[130px] truncate font-medium text-xs sm:max-w-[180px]"
      >
        {renderName()}
      </span>

      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
        {formatFileSize(attachment.size)}
      </span>

      {!readOnly && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(attachment.id);
          }}
          className="ml-0.5 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
          aria-label={`Remove attachment ${attachment.name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
