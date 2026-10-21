'use client';

import { useState, useRef, useEffect, useSyncExternalStore, DragEvent } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageFeed } from '@/components/chat/MessageFeed';
import { ChatInput, ChatInputHandle } from '@/components/chat/ChatInput';
import { streamMockResponse } from '@/lib/streamMock';
import { Attachment } from '@/types/chat';
import { nanoid } from 'nanoid';
import { Upload } from 'lucide-react';

const emptySubscribe = () => () => {};

export default function ChatPage() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);

  const chatInputRef = useRef<ChatInputHandle | null>(null);
  const dragCounterRef = useRef(0);
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

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
      dragCounterRef.current += 1;
      setIsDraggingFiles(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDraggingFiles(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDraggingFiles(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      chatInputRef.current?.addFiles(e.dataTransfer.files);
    }
  };

  const handleSendMessage = async (content: string, attachments?: Attachment[]) => {
    if (!activeThread || isStreaming) return;

    const threadId = activeThread.id;
    const userMsgId = nanoid();
    const assistantMsgId = nanoid();

    // 1. Add user message with attachments
    addMessage(threadId, {
      id: userMsgId,
      role: 'user',
      content,
      attachments,
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
        attachments,
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
      <main
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative flex flex-1 flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/20"
      >
        {/* Full-area Drop Overlay */}
        {isDraggingFiles && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-900/75 p-6 text-white backdrop-blur-xs animate-in fade-in-0 duration-150">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10 mb-3 animate-bounce">
              <Upload className="h-8 w-8" />
            </div>
            <p className="text-base font-semibold tracking-tight">Drop files to attach</p>
            <p className="mt-1 text-xs text-zinc-300">
              PDF, DOCX, TXT, JSON, MD, PNG, JPG (max 10 MB per file)
            </p>
          </div>
        )}

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
          ref={chatInputRef}
          onSendMessage={handleSendMessage}
          onStopStreaming={handleStopStreaming}
          isStreaming={isStreaming}
          disabled={!activeThread}
        />
      </main>
    </div>
  );
}
