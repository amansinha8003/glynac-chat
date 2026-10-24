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

import { motion, useReducedMotion } from 'framer-motion';

export function AttachmentChip({
  attachment,
  onRemove,
  readOnly = false,
  className,
  searchQuery,
  activeMatchIndex,
  getAttachmentMatchIndex,
}: AttachmentChipProps) {
  const shouldReduceMotion = useReducedMotion();

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
    <motion.div
      layout={!shouldReduceMotion}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors shadow-2xs select-none max-w-full',
        readOnly
          ? 'bg-muted/80 border-border text-foreground'
          : 'bg-card border-border text-card-foreground hover:border-muted-foreground/30',
        className
      )}
    >
      {getFileIcon(attachment.name, attachment.type)}

      <span
        title={attachment.name}
        className="max-w-[130px] truncate font-medium text-xs sm:max-w-[200px]"
      >
        {renderName()}
      </span>

      <span className="text-[10px] text-muted-foreground font-mono shrink-0">
        {formatFileSize(attachment.size)}
      </span>

      {!readOnly && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(attachment.id);
          }}
          className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0"
          aria-label={`Remove attachment ${attachment.name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  );
}
