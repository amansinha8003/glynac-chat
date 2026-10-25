'use client';

import { QUICK_PROMPTS } from '@/data/quickPrompts';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  variant?: 'empty' | 'inline';
  className?: string;
}

export function QuickPrompts({
  onSelectPrompt,
  variant = 'empty',
  className,
}: QuickPromptsProps) {
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs transition-all',
          className
        )}
      >
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground shrink-0 mr-1 select-none">
          <Sparkles className="h-3 w-3 text-emerald-500" />
          Suggested:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="shrink-0 text-left px-3 py-1 rounded-full border border-border/80 bg-surface/60 text-foreground hover:border-emerald-500/50 hover:bg-surface text-[11px] font-normal transition-all duration-150 shadow-2xs max-w-[260px] truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            title={prompt}
          >
            {prompt}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('w-full max-w-xl mx-auto mt-6', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="group flex flex-col justify-between p-3.5 rounded-2xl border border-border/80 bg-surface/50 hover:bg-surface hover:border-border text-xs text-foreground transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span className="text-[13px] font-normal leading-relaxed text-foreground/90 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {prompt}
            </span>
            <span className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1 select-none">
              <Sparkles className="h-2.5 w-2.5 text-emerald-500/70" />
              <span>Prompt template</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
