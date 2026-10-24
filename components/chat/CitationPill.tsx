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
              ? 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
              : 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 hover:bg-emerald-500/20 dark:text-emerald-300',
            className
          )}
        >
          {numberBadge !== undefined && (
            <span className="font-semibold text-[10px] opacity-75">
              [{numberBadge}]
            </span>
          )}
          {isUnknown ? (
            <AlertCircle className="h-3 w-3 shrink-0 text-muted-foreground" />
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
        className="w-80 sm:w-96 max-w-[calc(100vw-2rem)] p-3.5 bg-popover text-popover-foreground border border-border shadow-lg rounded-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-border pb-2.5">
          <div className="flex items-start gap-2 min-w-0">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-foreground truncate">
                {citation.label}
              </h4>
              <p className="text-[11px] text-muted-foreground truncate">
                {citation.source}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Close citation details"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Excerpt */}
        <div className="my-2.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Statutory Excerpt
          </span>
          <blockquote className="mt-1 rounded-r-md border-l-2 border-emerald-500 bg-emerald-500/5 py-1.5 pr-2 pl-3 text-xs italic leading-relaxed text-foreground/90 max-h-36 overflow-y-auto">
            &ldquo;{citation.excerpt}&rdquo;
          </blockquote>
        </div>

        {/* Footer */}
        <div className="mt-1 flex items-center justify-between pt-1">
          <span className="text-[10px] text-muted-foreground">
            Illustrative excerpt · see source for full text
          </span>
          {citation.docUrl ? (
            <a
              href={citation.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            >
              <span>Open document</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-[11px] text-muted-foreground italic">No external link</span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
