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
            'flex h-14 items-center border-b border-sidebar-border px-3',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs dark:bg-emerald-500">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div className="truncate">
                <span className="block text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Compliance AI
                </span>
                <span className="block text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  Audit Assistant
                </span>
              </div>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs dark:bg-emerald-500 cursor-pointer">
                  <ShieldCheck className="h-4.5 w-4.5" />
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
                  className="hidden md:inline-flex text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
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
              className="inline-flex md:hidden text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Header: New Chat & Search */}
        <div className="flex flex-col gap-2 p-3">
          {/* New Chat Button */}
          {!isCollapsed ? (
            <Button
              onClick={handleNewChat}
              className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
              <kbd className="ml-auto hidden text-[10px] text-primary-foreground/70 sm:inline-block font-mono">
                ⌘⇧O
              </kbd>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleNewChat}
                  variant="default"
                  size="icon-sm"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
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
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search threads... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-7 text-xs bg-sidebar/50 border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
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
                  className="w-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  aria-label="Search threads"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Search threads</TooltipContent>
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
                      <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
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
            <div className="flex flex-col items-center gap-1.5 py-1">
              {threads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                return (
                  <Tooltip key={thread.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleSelectThread(thread.id)}
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                          isActive
                            ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 shadow-xs'
                            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200'
                        )}
                        aria-label={thread.title}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="font-medium">{thread.title}</p>
                      <p className="text-[10px] text-zinc-400">
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
