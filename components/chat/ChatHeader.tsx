'use client';

import { Button } from '@/components/ui/button';
import { Menu, Shield, Pin } from 'lucide-react';
import { Thread } from '@/types/chat';

interface ChatHeaderProps {
  thread?: Thread;
  onOpenMobileMenu?: () => void;
}

export function ChatHeader({ thread, onOpenMobileMenu }: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white/60 px-4 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60">
      <div className="flex items-center gap-3 overflow-hidden">
        {onOpenMobileMenu && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onOpenMobileMenu}
            className="text-zinc-600 hover:text-zinc-900 md:hidden dark:text-zinc-400 dark:hover:text-zinc-100"
            aria-label="Open sidebar"
          >
            <Menu className="h-4.5 w-4.5" />
          </Button>
        )}

        <div className="flex items-center gap-2 overflow-hidden">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
          <h1 className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {thread?.title || 'No Active Thread'}
          </h1>
          {thread?.pinned && (
            <span title="Pinned thread" className="shrink-0 text-emerald-600 dark:text-emerald-400">
              <Pin className="h-3.5 w-3.5 fill-emerald-500/20" />
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600 shadow-2xs sm:inline-flex dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <Shield className="h-3 w-3 text-emerald-500" />
          SEC & FINRA Guardrails Active
        </span>
      </div>
    </header>
  );
}
