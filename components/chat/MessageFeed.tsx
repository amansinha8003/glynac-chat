'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { QuickPrompts } from './QuickPrompts';
import { SearchMatch } from '@/lib/searchMessages';
import { MessageSquarePlus } from 'lucide-react';

interface MessageFeedProps {
  messages: Message[];
  threadId?: string;
  isStreaming?: boolean;
  searchQuery?: string;
  activeMatchIndex?: number;
  matches?: SearchMatch[];
  isSearchOpen?: boolean;
  onSelectQuickPrompt?: (prompt: string) => void;
  onRegenerate?: () => void;
  onEditSave?: (messageId: string, newContent: string) => void;
}

export function MessageFeed({
  messages,
  threadId,
  isStreaming = false,
  searchQuery,
  activeMatchIndex,
  matches = [],
  isSearchOpen = false,
  onSelectQuickPrompt,
  onRegenerate,
  onEditSave,
}: MessageFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef<boolean>(true);

  // Reset auto-scroll flag when switching threads
  useEffect(() => {
    shouldAutoScrollRef.current = true;
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [threadId]);

  // Handle user scroll detection
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    // Allow auto-scroll only if user is within 60px of the bottom
    shouldAutoScrollRef.current = distanceFromBottom <= 60;
  };

  // Auto-scroll when messages length, last message content, or streaming state changes
  const lastMessage = messages[messages.length - 1];
  const lastMessageContent = lastMessage?.content;
  const totalMatches = matches.length;

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      // Pause auto-scroll-to-bottom while streaming when search is open and match is active
      if (isSearchOpen && totalMatches > 0) {
        return;
      }
      const el = containerRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }
  }, [messages.length, lastMessageContent, isStreaming, isSearchOpen, totalMatches]);

  // Smoothly scroll active search match into view (centered)
  useEffect(() => {
    if (isSearchOpen && totalMatches > 0 && activeMatchIndex !== undefined) {
      const el = document.getElementById(`search-match-${activeMatchIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isSearchOpen, activeMatchIndex, totalMatches]);

  const lastAssistantIndex = messages.map((m) => m.role).lastIndexOf('assistant');

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-6"
    >
      <div className="mx-auto flex min-h-full max-w-3xl flex-col">
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50 duration-300">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-950/20">
              <MessageSquarePlus className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Start a conversation
            </h3>
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Query regulatory requirements, evaluate communications for SEC & FINRA compliance, or test disclosures.
            </p>

            {onSelectQuickPrompt && (
              <QuickPrompts onSelectPrompt={onSelectQuickPrompt} variant="empty" />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => {
              const contentMatches = matches.filter(
                (m) => m.messageId === message.id && m.type === 'content'
              );
              const attachmentMatches = matches.filter(
                (m) => m.messageId === message.id && m.type === 'attachment'
              );

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  threadId={threadId}
                  isLastAssistantMessage={index === lastAssistantIndex}
                  isStreaming={isStreaming}
                  searchQuery={searchQuery}
                  activeMatchIndex={activeMatchIndex}
                  contentMatches={contentMatches}
                  attachmentMatches={attachmentMatches}
                  onRegenerate={onRegenerate}
                  onEditSave={onEditSave}
                />
              );
            })}
            <div ref={bottomRef} className="h-px w-full" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
