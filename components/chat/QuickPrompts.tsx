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
          'flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-1 text-xs transition-all',
          className
        )}
      >
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 shrink-0 mr-0.5">
          <Sparkles className="h-3 w-3 text-emerald-500" />
          Suggested:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="shrink-0 text-left px-3 py-1 rounded-full border border-zinc-200/90 bg-white text-zinc-700 hover:border-emerald-500/80 hover:text-emerald-700 hover:bg-emerald-50/30 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:border-emerald-600 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/20 text-[11px] font-medium transition-all shadow-2xs max-w-[260px] truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
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
      <div className="flex items-center justify-center gap-1.5 mb-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
        <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
        <span>Try asking about compliance topics:</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="group flex items-start gap-2.5 p-3 rounded-xl border border-zinc-200 bg-white/90 hover:border-emerald-500 hover:bg-emerald-50/40 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30 text-xs text-zinc-700 dark:text-zinc-300 transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform dark:bg-emerald-950 dark:text-emerald-400">
              <Sparkles className="h-3 w-3" />
            </span>
            <span className="font-medium leading-relaxed group-hover:text-emerald-900 dark:group-hover:text-emerald-200 transition-colors">
              {prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
