'use client';

import { Message } from '@/types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';
import { format, isValid } from 'date-fns';
import { Bot, User } from 'lucide-react';

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
          <div className="hidden sm:flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
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

  return (
    <div className="flex w-full flex-col items-start transition-opacity animate-in fade-in-50 duration-200">
      <div className="flex max-w-[95%] items-start gap-2.5 sm:max-w-[90%] md:max-w-[85%]">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-2xs dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400">
          <Bot className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 rounded-2xl rounded-tl-xs border border-zinc-200/80 bg-white px-4 py-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
          <MarkdownRenderer content={message.content} />
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
