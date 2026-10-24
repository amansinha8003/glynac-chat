'use client';

import { useEffect, useRef, KeyboardEvent } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MessageSearch() {
  const {
    isOpen,
    query,
    debouncedQuery,
    activeIndex,
    totalMatches,
    setQuery,
    setDebouncedQuery,
    nextMatch,
    prevMatch,
    closeSearch,
  } = useSearchStore();

  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isOpen]);

  // Debounce query input by ~150ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    return () => clearTimeout(handler);
  }, [query, setDebouncedQuery]);

  // Keyboard navigation on input
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        prevMatch();
      } else {
        nextMatch();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="search"
      aria-label="In-chat message search"
      className="w-full border-b border-border bg-background/95 px-3 py-1.5 backdrop-blur-md transition-all duration-150 animate-in slide-in-from-top-1 shadow-2xs z-30"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        {/* Search Input Box */}
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search messages and attachments... (Enter / Shift+Enter to navigate)"
            className="h-8 w-full rounded-lg border border-input bg-muted/40 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:bg-background focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
            aria-label="Search messages input"
          />
        </div>

        {/* Match Counter Badge */}
        <div className="min-w-[64px] text-right">
          {debouncedQuery.trim() ? (
            <span
              className={`text-[11px] font-medium select-none ${
                totalMatches === 0
                  ? 'text-destructive font-semibold'
                  : 'text-muted-foreground'
              }`}
            >
              {totalMatches === 0 ? 'No matches' : `${activeIndex + 1} of ${totalMatches}`}
            </span>
          ) : null}
        </div>

        {/* Navigation Buttons: Previous / Next */}
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={prevMatch}
            disabled={totalMatches === 0}
            className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
            aria-label="Previous match"
            title="Previous match (Shift+Enter)"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={nextMatch}
            disabled={totalMatches === 0}
            className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
            aria-label="Next match"
            title="Next match (Enter)"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>

          {/* Close Search Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={closeSearch}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            aria-label="Close search"
            title="Close search (Esc)"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
