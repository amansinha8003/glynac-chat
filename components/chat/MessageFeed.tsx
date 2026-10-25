'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { QuickPrompts } from './QuickPrompts';
import { SearchMatch } from '@/lib/searchMessages';
import { ShieldCheck, ArrowDown } from 'lucide-react';

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
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Reset auto-scroll flag when switching threads
  useEffect(() => {
    shouldAutoScrollRef.current = true;
    setShowScrollBottom(false);
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
    // Allow auto-scroll only if user is within 80px of the bottom
    shouldAutoScrollRef.current = distanceFromBottom <= 80;
    setShowScrollBottom(distanceFromBottom > 150);
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      shouldAutoScrollRef.current = true;
      setShowScrollBottom(false);
    }
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
      className="relative flex-1 min-h-0 overflow-y-auto px-4 py-6 scroll-smooth"
      tabIndex={0}
      aria-label="Message feed"
    >
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isStreaming
          ? 'Compliance AI is streaming a regulatory response.'
          : messages.length > 0
          ? 'Response complete.'
          : 'Ready for inquiry.'}
      </div>

      <div className="mx-auto flex min-h-full max-w-3xl flex-col">
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center px-4 py-12 text-center animate-in fade-in-50 duration-300">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              How can I help with compliance today?
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Evaluate marketing materials, audit disclosures, and research SEC & FINRA rules.
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

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="fixed bottom-24 right-6 sm:right-10 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Scroll to latest messages"
          title="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
