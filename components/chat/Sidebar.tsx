'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { useChatStore } from '@/store/chatStore';
import { groupThreads } from '@/lib/groupThreads';
import { ThreadItem } from './ThreadItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  MessageSquarePlus,
  MessageSquare,
  FileQuestion,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const { threads, activeThreadId, setActiveThread, createThread } = useChatStore();

  const grouped = useMemo(() => {
    return groupThreads(threads, searchQuery);
  }, [threads, searchQuery]);

  const handleNewChat = React.useCallback(() => {
    createThread();
    if (mobileOpen) {
      onMobileClose();
    }
  }, [createThread, mobileOpen, onMobileClose]);

  const handleSelectThread = (id: string) => {
    setActiveThread(id);
    if (mobileOpen) {
      onMobileClose();
    }
  };

  // Keyboard shortcuts: Ctrl/Cmd+K to focus search, Ctrl/Cmd+Shift+O to new chat
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isCollapsed) {
          onToggleCollapse();
        }
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      } else if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === 'o'
      ) {
        e.preventDefault();
        handleNewChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed, onToggleCollapse, handleNewChat]);

  return (
    <TooltipProvider delayDuration={200}>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Conversation threads"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground transition-all duration-300 ease-in-out md:static md:z-auto',
          // Mobile responsive position
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0',
          // Desktop width
          isCollapsed ? 'md:w-16' : 'md:w-72'
        )}
      >
        {/* Top Header */}
        <div
          className={cn(
            'flex h-13 items-center border-b border-sidebar-border px-3.5',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span className="truncate text-xs font-semibold tracking-tight text-sidebar-foreground">
                Compliance AI
              </span>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-pointer">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Compliance AI</TooltipContent>
            </Tooltip>
          )}

          {/* Controls: Collapse button (desktop) / Close button (mobile) */}
          <div className="flex items-center">
            {/* Desktop Collapse Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={onToggleCollapse}
                  className="hidden md:inline-flex text-muted-foreground hover:bg-surface hover:text-sidebar-foreground transition-colors duration-150 rounded-md"
                  aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isCollapsed ? 'right' : 'bottom'}>
                {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              </TooltipContent>
            </Tooltip>

            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onMobileClose}
              className="inline-flex md:hidden text-muted-foreground hover:bg-surface hover:text-sidebar-foreground transition-colors duration-150 rounded-md"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Header: New Chat & Search */}
        <div className="flex flex-col gap-1.5 p-3">
          {/* New Chat Row */}
          {!isCollapsed ? (
            <button
              type="button"
              onClick={handleNewChat}
              className="group flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-medium text-sidebar-foreground transition-colors duration-150 hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Plus className="h-4 w-4 text-muted-foreground group-hover:text-sidebar-foreground transition-colors" />
              <span>New chat</span>
              <kbd className="ml-auto hidden text-[10px] text-muted-foreground sm:inline-block font-mono">
                ⌘⇧O
              </kbd>
            </button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleNewChat}
                  variant="ghost"
                  size="icon-sm"
                  className="w-full h-9 rounded-lg text-sidebar-foreground hover:bg-surface"
                  aria-label="New Chat"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">New Chat (⌘⇧O)</TooltipContent>
            </Tooltip>
          )}

          {/* Search Input */}
          {!isCollapsed ? (
            <div className="relative mt-0.5">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/70 pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search chats... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-7 text-xs bg-surface/70 hover:bg-surface/90 border border-transparent hover:border-border/50 focus:border-border focus:bg-surface text-sidebar-foreground placeholder:text-muted-foreground/70 rounded-lg transition-colors focus-visible:ring-1 focus-visible:ring-ring"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-muted-foreground hover:text-sidebar-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onToggleCollapse}
                  className="w-full h-9 rounded-lg text-muted-foreground hover:bg-surface hover:text-sidebar-foreground"
                  aria-label="Search threads"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Search threads (⌘K)</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Scrollable Thread List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {!isCollapsed ? (
            <>
              {grouped.length > 0 ? (
                <div className="space-y-4">
                  {grouped.map((group) => (
                    <div key={group.label} className="space-y-0.5">
                      <div className="px-2.5 pt-3 pb-1 text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                        {group.label}
                      </div>
                      <div className="space-y-0.5">
                        {group.threads.map((thread) => (
                          <ThreadItem
                            key={thread.id}
                            thread={thread}
                            isActive={thread.id === activeThreadId}
                            onSelect={handleSelectThread}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty States */
                <div className="flex h-48 flex-col items-center justify-center p-4 text-center">
                  {searchQuery ? (
                    <>
                      <FileQuestion className="h-8 w-8 text-muted-foreground/80 mb-2 stroke-1" />
                      <p className="text-xs font-semibold text-sidebar-foreground">
                        No threads found
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1 max-w-[180px]">
                        No compliance discussions match &ldquo;{searchQuery}&rdquo;.
                      </p>
                      <Button
                        variant="link"
                        size="xs"
                        onClick={() => setSearchQuery('')}
                        className="mt-2 text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        Clear search
                      </Button>
                    </>
                  ) : (
                    <>
                      <MessageSquarePlus className="h-8 w-8 text-muted-foreground/80 mb-2 stroke-1" />
                      <p className="text-xs font-semibold text-sidebar-foreground">
                        No conversations yet
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1 max-w-[180px]">
                        Start an audit review or ask a regulatory question.
                      </p>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={handleNewChat}
                        className="mt-3 text-xs"
                      >
                        Create Thread
                      </Button>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Collapsed Rail View */
            <div className="flex flex-col items-center gap-1 py-1">
              {threads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                return (
                  <Tooltip key={thread.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleSelectThread(thread.id)}
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-foreground shadow-2xs font-medium'
                            : 'text-muted-foreground hover:bg-surface hover:text-sidebar-foreground'
                        )}
                        aria-label={thread.title}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="font-medium text-xs">{thread.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {thread.messages.length} messages
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
