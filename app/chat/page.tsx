'use client';

import { useState, useSyncExternalStore } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageFeed } from '@/components/chat/MessageFeed';
import { ChatInput } from '@/components/chat/ChatInput';

const emptySubscribe = () => () => {};

export default function ChatPage() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const threads = useChatStore((state) => state.threads);
  const activeThreadId = useChatStore((state) => state.activeThreadId);
  const addMessage = useChatStore((state) => state.addMessage);

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

  const handleSendMessage = (content: string) => {
    if (!activeThread) return;

    // 1. Add user message
    addMessage(activeThread.id, {
      role: 'user',
      content,
    });

    // 2. Add hardcoded assistant reply after 500ms
    setTimeout(() => {
      addMessage(activeThread.id, {
        role: 'assistant',
        content: `Under current regulatory guidance, communications and disclosures must be reviewed for accuracy, balanced risk portrayal, and supervisory approval.\n\n* **Status**: Preliminary review logged.\n* **Reference**: SEC Rule 206(4)-1 & FINRA Rule 2210.\n\nEnsure compliance retention in accordance with standard WORM archiving requirements [[cite:sec-17a-4]].`,
      });
    }, 500);
  };

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
        {/* Chat Header */}
        <ChatHeader
          thread={activeThread}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        {/* Message Feed */}
        <MessageFeed
          messages={activeThread?.messages ?? []}
          threadId={activeThread?.id}
        />

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={!activeThread}
        />
      </main>
    </div>
  );
}
