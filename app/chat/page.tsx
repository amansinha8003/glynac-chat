'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chatStore';

export default function ChatPage() {
  const [mounted, setMounted] = useState(false);
  const threads = useChatStore((state) => state.threads);
  const activeThreadId = useChatStore((state) => state.activeThreadId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <p className="text-sm">Loading compliance workspace...</p>
      </div>
    );
  }

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? threads[0];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-100">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Compliance AI Assistant
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-100">
          {activeThread?.title ?? 'No Active Thread'}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-zinc-400">
          <div className="rounded-lg bg-zinc-800/80 px-3 py-1.5 font-mono text-xs text-zinc-200">
            Messages: <span className="font-semibold text-emerald-400">{activeThread?.messages.length ?? 0}</span>
          </div>
          <div className="rounded-lg bg-zinc-800/80 px-3 py-1.5 font-mono text-xs text-zinc-200">
            Total Threads: <span className="font-semibold text-zinc-100">{threads.length}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
