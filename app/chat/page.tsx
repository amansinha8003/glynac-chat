'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Sidebar } from '@/components/chat/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu, MessageSquare, Shield, Clock, Sparkles } from 'lucide-react';

export default function ChatPage() {
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const threads = useChatStore((state) => state.threads);
  const activeThreadId = useChatStore((state) => state.activeThreadId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span>Loading compliance workspace...</span>
        </div>
      </div>
    );
  }

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? threads[0];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
      {/* Sidebar (Left Column) */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Chat Area (Right Column) */}
      <main className="flex flex-1 flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/20">
        {/* Top Navigation Bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 px-4 dark:border-zinc-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Hamburger Button for Mobile */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              aria-label="Open sidebar"
            >
              <Menu className="h-4.5 w-4.5" />
            </Button>

            <div className="flex items-center gap-2 truncate">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <h1 className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {activeThread?.title ?? 'No Active Thread'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
              <Shield className="h-3 w-3 text-emerald-500" />
              SEC & FINRA Guardrails Active
            </span>
          </div>
        </header>

        {/* Content Placeholder Area */}
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-950/30">
              <Sparkles className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {activeThread?.title ?? 'Select or Create a Thread'}
            </h2>

            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              Interactive compliance workspace and conversational assistant
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300">
                <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
                <span>
                  Messages:{' '}
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {activeThread?.messages.length ?? 0}
                  </strong>
                </span>
              </div>

              {activeThread && (
                <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  <span>
                    Updated:{' '}
                    <strong className="text-zinc-900 dark:text-zinc-100">
                      {new Date(activeThread.updatedAt).toLocaleDateString()}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
