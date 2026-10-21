'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onStopStreaming?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  onStopStreaming,
  isStreaming = false,
  disabled = false,
}: ChatInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || disabled || isStreaming) return;

    onSendMessage(trimmed);
    setContent('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 180)}px`;
  };

  return (
    <div className="w-full border-t border-zinc-200/80 bg-white/80 p-3 sm:p-4 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto max-w-3xl">
        <div className="relative flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-xs transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-900/90 dark:focus-within:border-emerald-500 dark:focus-within:ring-emerald-500/20">
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || isStreaming}
            placeholder={
              isStreaming
                ? 'AI is generating compliance analysis...'
                : 'Ask about compliance policies, regulations, or draft a disclosure... (Enter to send)'
            }
            className="w-full resize-none bg-transparent px-4 pt-3.5 pb-12 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none disabled:opacity-60 dark:text-zinc-100 dark:placeholder-zinc-500 min-h-[54px] max-h-[180px] leading-relaxed"
          />

          <div className="absolute right-2.5 bottom-2.5 flex items-center gap-2">
            {!isStreaming && (
              <span className="hidden text-[11px] text-zinc-400 sm:inline-flex items-center gap-1 mr-1">
                <span>Press</span>
                <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
                  ↵
                </kbd>
              </span>
            )}

            {isStreaming ? (
              <Button
                type="button"
                size="icon-sm"
                onClick={onStopStreaming}
                className="h-8 w-8 rounded-xl bg-zinc-900 text-white shadow-2xs transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                aria-label="Stop generation"
              >
                <Square className="h-3 w-3 fill-current" />
              </Button>
            ) : (
              <Button
                type="button"
                size="icon-sm"
                disabled={!content.trim() || disabled}
                onClick={handleSend}
                className="h-8 w-8 rounded-xl bg-emerald-600 text-white shadow-2xs transition hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
          AI assistant provides compliance analysis. Verify against primary FINRA & SEC regulatory sources.
        </p>
      </div>
    </div>
  );
}
