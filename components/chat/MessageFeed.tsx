'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { MessageSquarePlus } from 'lucide-react';

interface MessageFeedProps {
  messages: Message[];
  threadId?: string;
}

export function MessageFeed({ messages, threadId }: MessageFeedProps) {
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
  const isStreaming = lastMessage?.isStreaming;

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      const el = containerRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }
  }, [messages.length, lastMessageContent, isStreaming]);

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
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={bottomRef} className="h-px w-full" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
