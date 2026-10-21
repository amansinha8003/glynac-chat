'use client';

import { Message } from '@/types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CitationPill } from './CitationPill';
import { getUniqueCitations } from '@/lib/citations';
import { format, isValid } from 'date-fns';
import { Bot, User, Bookmark } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const formattedTime = (() => {
    if (!message.createdAt) return '';
    const date = new Date(message.createdAt);
    return isValid(date) ? format(date, 'h:mm a') : '';
  })();

  if (isUser) {
    return (
      <div className="flex w-full flex-col items-end transition-opacity animate-in fade-in-50 duration-200">
        <div className="flex max-w-[85%] items-end gap-2 sm:max-w-[75%]">
          <div className="rounded-2xl rounded-tr-xs bg-emerald-600 px-4 py-2.5 text-sm text-white shadow-xs dark:bg-emerald-600 dark:text-white">
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
          <div className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 sm:flex dark:bg-emerald-950 dark:text-emerald-300">
            <User className="h-3.5 w-3.5" />
          </div>
        </div>
        {formattedTime && (
          <span className="mt-1 px-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            {formattedTime}
          </span>
        )}
      </div>
    );
  }

  const uniqueCitations = !isUser && message.content ? getUniqueCitations(message.content) : [];

  return (
    <div className="flex w-full flex-col items-start transition-opacity animate-in fade-in-50 duration-200">
      <div className="flex max-w-[95%] items-start gap-2.5 sm:max-w-[90%] md:max-w-[85%]">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-2xs dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400">
          <Bot className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 rounded-2xl rounded-tl-xs border border-zinc-200/80 bg-white px-4 py-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          {message.isStreaming && !message.content ? (
            <div className="flex items-center gap-1.5 py-1 px-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" />
            </div>
          ) : (
            <div className="relative">
              <MarkdownRenderer content={message.content} isStreaming={message.isStreaming} />
              {message.isStreaming && (
                <span
                  className="inline-block h-3.5 w-1.5 translate-y-0.5 ml-1 rounded-2xs bg-emerald-500 animate-pulse align-middle"
                  aria-hidden="true"
                />
              )}

              {/* Sources footer for assistant messages */}
              {uniqueCitations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                    <Bookmark className="h-3 w-3 text-emerald-500" />
                    <span>Sources ({uniqueCitations.length})</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {uniqueCitations.map((citation, idx) => (
                      <CitationPill
                        key={citation.id}
                        citation={citation}
                        numberBadge={idx + 1}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {formattedTime && (
        <span className="mt-1 pl-10 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
          {formattedTime}
        </span>
      )}
    </div>
  );
}
