'use client';

import { useState } from 'react';
import { Citation } from '@/types/chat';
import { getCitationById } from '@/lib/citations';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { BookOpen, ExternalLink, X, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CitationPillProps {
  citationId?: string;
  citation?: Citation;
  numberBadge?: number;
  className?: string;
}

export function CitationPill({
  citationId,
  citation: directCitation,
  numberBadge,
  className,
}: CitationPillProps) {
  const [open, setOpen] = useState(false);

  const citation: Citation =
    directCitation ||
    (citationId ? getCitationById(citationId) : null) || {
      id: citationId || 'unknown',
      label: 'Unknown Source',
      source: citationId ? `Reference: ${citationId}` : 'Unspecified Source',
      excerpt: 'No specific regulatory excerpt is registered for this citation.',
      docUrl: '',
    };

  const isUnknown = citation.label === 'Unknown Source' || !citation.docUrl;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Citation: ${citation.label}`}
          className={cn(
            'inline-flex items-center gap-1 mx-0.5 px-2 py-0.5 align-baseline rounded-full text-[11px] font-medium transition-all cursor-pointer shadow-2xs select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40',
            isUnknown
              ? 'bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 dark:hover:bg-zinc-700/80'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 dark:hover:bg-emerald-900/60',
            className
          )}
        >
          {numberBadge !== undefined && (
            <span className="font-semibold text-[10px] opacity-75">
              [{numberBadge}]
            </span>
          )}
          {isUnknown ? (
            <AlertCircle className="h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500" />
          ) : (
            <BookOpen className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
          )}
          <span className="truncate max-w-[150px]">{citation.label}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="top"
        sideOffset={6}
        collisionPadding={16}
        className="w-80 sm:w-96 max-w-[calc(100vw-2rem)] p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg rounded-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
          <div className="flex items-start gap-2 min-w-0">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <FileText className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-zinc-900 truncate dark:text-zinc-100">
                {citation.label}
              </h4>
              <p className="text-[11px] text-zinc-500 truncate dark:text-zinc-400">
                {citation.source}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
            aria-label="Close citation details"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Excerpt */}
        <div className="my-2.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Statutory Excerpt
          </span>
          <blockquote className="mt-1 rounded-r-md border-l-2 border-emerald-500 bg-emerald-50/50 py-1.5 pr-2 pl-3 text-xs italic leading-relaxed text-zinc-700 max-h-36 overflow-y-auto dark:bg-emerald-950/20 dark:text-zinc-300">
            &ldquo;{citation.excerpt}&rdquo;
          </blockquote>
        </div>

        {/* Footer */}
        <div className="mt-1 flex items-center justify-between pt-1">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
            Verifiable source record
          </span>
          {citation.docUrl ? (
            <a
              href={citation.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <span>Open document</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-[11px] text-zinc-400 italic">No external link</span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
