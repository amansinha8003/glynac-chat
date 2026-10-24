'use client';

import { useState, useRef, useEffect, useMemo, useSyncExternalStore, DragEvent } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useSearchStore } from '@/store/searchStore';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageSearch } from '@/components/chat/MessageSearch';
import { MessageFeed } from '@/components/chat/MessageFeed';
import { ChatInput, ChatInputHandle } from '@/components/chat/ChatInput';
import { QuickPrompts } from '@/components/chat/QuickPrompts';
import { streamMockResponse } from '@/lib/streamMock';
import { searchMessages } from '@/lib/searchMessages';
import { Attachment, Message } from '@/types/chat';
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
  const deleteMessage = useChatStore((state) => state.deleteMessage);
  const updateMessageContent = useChatStore((state) => state.updateMessageContent);
  const deleteMessagesAfter = useChatStore((state) => state.deleteMessagesAfter);

  const {
    debouncedQuery,
    activeIndex,
    isOpen: isSearchOpen,
    openSearch,
    resetSearch,
    setTotalMatches,
  } = useSearchStore();

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Reset search state when active thread changes
  useEffect(() => {
    resetSearch();
  }, [activeThreadId, resetSearch]);

  // Global Ctrl/Cmd + F shortcut to toggle message search
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? threads[0];
  const messages = activeThread?.messages ?? [];

  // Compute search matches dynamically over messages and attachments
  const searchMatches = useMemo(() => {
    return searchMessages(messages, debouncedQuery);
  }, [messages, debouncedQuery]);

  // Update total matches in search store
  useEffect(() => {
    setTotalMatches(searchMatches.length);
  }, [searchMatches.length, setTotalMatches]);

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
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (controller.signal.aborted) {
        return;
      }

      await streamMockResponse({
        prompt: content,
        attachments,
        onChunk: (chunk) => {
          appendToMessage(threadId, assistantMsgId, chunk);
        },
        signal: controller.signal,
      });
    } catch {
      // Abort
    } finally {
      updateMessage(threadId, assistantMsgId, { isStreaming: false });
      setIsStreaming(false);
      abortControllerRef.current = null;
      currentStreamingRef.current = null;
    }
  };

  const handleRegenerate = async () => {
    if (!activeThread || isStreaming) return;

    const lastAssistantIndex = messages.map((m) => m.role).lastIndexOf('assistant');
    if (lastAssistantIndex === -1) return;

    const lastAssistant = messages[lastAssistantIndex];

    // Find closest preceding user message
    let precedingUser: Message | undefined;
    for (let i = lastAssistantIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        precedingUser = messages[i];
        break;
      }
    }

    if (!precedingUser) return;

    // Delete last assistant message
    const threadId = activeThread.id;
    deleteMessage(threadId, lastAssistant.id);

    // Stream a new reply
    const newAssistantMsgId = nanoid();
    addMessage(threadId, {
      id: newAssistantMsgId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    });

    setIsStreaming(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    currentStreamingRef.current = { threadId, messageId: newAssistantMsgId };

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (controller.signal.aborted) return;

      await streamMockResponse({
        prompt: precedingUser.content,
        attachments: precedingUser.attachments,
        onChunk: (chunk) => {
          appendToMessage(threadId, newAssistantMsgId, chunk);
        },
        signal: controller.signal,
      });
    } catch {
      // Abort
    } finally {
      updateMessage(threadId, newAssistantMsgId, { isStreaming: false });
      setIsStreaming(false);
      abortControllerRef.current = null;
      currentStreamingRef.current = null;
    }
  };

  const handleEditSave = async (messageId: string, newContent: string) => {
    if (!activeThread || isStreaming) return;

    const threadId = activeThread.id;
    const targetMessage = messages.find((m) => m.id === messageId);
    const attachments = targetMessage?.attachments;

    // 1. Update user message content
    updateMessageContent(threadId, messageId, newContent);

    // 2. Delete every message after it in the thread
    deleteMessagesAfter(threadId, messageId);

    // 3. Stream a new assistant reply
    const newAssistantMsgId = nanoid();
    addMessage(threadId, {
      id: newAssistantMsgId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    });

    setIsStreaming(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    currentStreamingRef.current = { threadId, messageId: newAssistantMsgId };

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (controller.signal.aborted) return;

      await streamMockResponse({
        prompt: newContent,
        attachments,
        onChunk: (chunk) => {
          appendToMessage(threadId, newAssistantMsgId, chunk);
        },
        signal: controller.signal,
      });
    } catch {
      // Abort
    } finally {
      updateMessage(threadId, newAssistantMsgId, { isStreaming: false });
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

  const hasMessages = messages.length > 0;
  const lastMessage = messages[messages.length - 1];
  const showInlinePrompts =
    hasMessages && !isStreaming && lastMessage?.role === 'assistant';

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

        {/* In-Chat Message Search Bar */}
        <MessageSearch />

        {/* Message Feed */}
        <MessageFeed
          messages={messages}
          threadId={activeThread?.id}
          isStreaming={isStreaming}
          searchQuery={debouncedQuery}
          activeMatchIndex={activeIndex}
          matches={searchMatches}
          isSearchOpen={isSearchOpen}
          onSelectQuickPrompt={(prompt) => handleSendMessage(prompt)}
          onRegenerate={handleRegenerate}
          onEditSave={handleEditSave}
        />

        {/* Suggested Quick Prompts (above input after assistant finishes) */}
        {showInlinePrompts && (
          <div className="w-full border-t border-zinc-200/50 bg-white/60 px-4 py-1 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/60">
            <div className="mx-auto max-w-3xl">
              <QuickPrompts
                onSelectPrompt={(prompt) => handleSendMessage(prompt)}
                variant="inline"
              />
            </div>
          </div>
        )}

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
