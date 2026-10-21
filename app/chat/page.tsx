'use client';

import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageFeed } from '@/components/chat/MessageFeed';
import { ChatInput } from '@/components/chat/ChatInput';
import { streamMockResponse } from '@/lib/streamMock';
import { nanoid } from 'nanoid';

const emptySubscribe = () => () => {};

export default function ChatPage() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const currentStreamingRef = useRef<{ threadId: string; messageId: string } | null>(null);

  const threads = useChatStore((state) => state.threads);
  const activeThreadId = useChatStore((state) => state.activeThreadId);
  const addMessage = useChatStore((state) => state.addMessage);
  const appendToMessage = useChatStore((state) => state.appendToMessage);
  const updateMessage = useChatStore((state) => state.updateMessage);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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

  const handleSendMessage = async (content: string) => {
    if (!activeThread || isStreaming) return;

    const threadId = activeThread.id;
    const userMsgId = nanoid();
    const assistantMsgId = nanoid();

    // 1. Add user message
    addMessage(threadId, {
      id: userMsgId,
      role: 'user',
      content,
    });

    // 2. Add empty assistant message with isStreaming: true
    addMessage(threadId, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    });

    setIsStreaming(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    currentStreamingRef.current = { threadId, messageId: assistantMsgId };

    try {
      // Wait ~600ms showing thinking indicator with 3 animated dots
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (controller.signal.aborted) {
        return;
      }

      // Stream chunks into message using appendToMessage
      await streamMockResponse({
        prompt: content,
        onChunk: (chunk) => {
          appendToMessage(threadId, assistantMsgId, chunk);
        },
        signal: controller.signal,
      });
    } catch {
      // Handle abort or error gracefully
    } finally {
      updateMessage(threadId, assistantMsgId, { isStreaming: false });
      setIsStreaming(false);
      abortControllerRef.current = null;
      currentStreamingRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (currentStreamingRef.current) {
      const { threadId, messageId } = currentStreamingRef.current;
      updateMessage(threadId, messageId, { isStreaming: false });
    }
    setIsStreaming(false);
    abortControllerRef.current = null;
    currentStreamingRef.current = null;
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
          onStopStreaming={handleStopStreaming}
          isStreaming={isStreaming}
          disabled={!activeThread}
        />
      </main>
    </div>
  );
}
