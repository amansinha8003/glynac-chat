'use client';

import { Button } from '@/components/ui/button';
import { Menu, Shield, Pin, Search } from 'lucide-react';
import { Thread } from '@/types/chat';
import { useSearchStore } from '@/store/searchStore';
import { ThemeToggle } from './ThemeToggle';
import { ShortcutsDialog } from './ShortcutsDialog';

interface ChatHeaderProps {
  thread?: Thread;
  onOpenMobileMenu?: () => void;
}

export function ChatHeader({ thread, onOpenMobileMenu }: ChatHeaderProps) {
  const toggleSearch = useSearchStore((state) => state.toggleSearch);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/70 px-4 backdrop-blur-md z-20">
      <div className="flex items-center gap-2.5 overflow-hidden min-w-0 pr-2">
        {onOpenMobileMenu && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenMobileMenu}
            className="h-9 w-9 text-muted-foreground hover:text-foreground md:hidden shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
          <h1 className="truncate text-sm font-semibold tracking-tight text-foreground max-w-[180px] sm:max-w-xs md:max-w-md">
            {thread?.title || 'No Active Thread'}
          </h1>
          {thread?.pinned && (
            <span title="Pinned thread" className="shrink-0 text-emerald-600 dark:text-emerald-400">
              <Pin className="h-3.5 w-3.5 fill-emerald-500/20" />
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={toggleSearch}
          className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Search messages"
          title="Search messages (Ctrl+F)"
        >
          <Search className="h-4 w-4" />
        </Button>

        <ShortcutsDialog />

        <ThemeToggle />

        <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs lg:inline-flex">
          <Shield className="h-3 w-3 text-emerald-500" />
          SEC & FINRA Guardrails
        </span>
      </div>
    </header>
  );
}
