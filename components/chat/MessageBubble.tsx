'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Message } from '@/types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CitationPill } from './CitationPill';
import { AttachmentChip } from './AttachmentChip';
import { MessageActions } from './MessageActions';
import { getUniqueCitations } from '@/lib/citations';
import { Button } from '@/components/ui/button';
import { format, isValid } from 'date-fns';
import { Bot, User, Bookmark, Pencil } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  threadId?: string;
  isLastAssistantMessage?: boolean;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  onEditSave?: (messageId: string, newContent: string) => void;
}

export function MessageBubble({
  message,
  threadId,
  isLastAssistantMessage = false,
  isStreaming = false,
  onRegenerate,
  onEditSave,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      textareaRef.current.selectionEnd = textareaRef.current.value.length;
    }
  }, [isEditing]);

  const formattedTime = (() => {
    if (!message.createdAt) return '';
    const date = new Date(message.createdAt);
    return isValid(date) ? format(date, 'h:mm a') : '';
  })();

  const handleSave = () => {
    const trimmed = editContent.trim();
    if (!trimmed || isStreaming) return;
    onEditSave?.(message.id, trimmed);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setEditContent(message.content);
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  if (isUser) {
    if (isEditing) {
      return (
        <div className="flex w-full flex-col items-end transition-all animate-in fade-in-50 duration-200">
          <div className="w-full max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs border border-emerald-500 bg-white p-3.5 shadow-md dark:border-emerald-600 dark:bg-zinc-900">
            {message.attachments && message.attachments.length > 0 && (
              <div className="mb-2.5 flex flex-wrap gap-1.5 justify-start">
                {message.attachments.map((att) => (
                  <AttachmentChip key={att.id} attachment={att} readOnly />
                ))}
              </div>
            )}
            <textarea
              ref={textareaRef}
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-zinc-100"
            />
            <div className="mt-2.5 flex items-center justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                Esc to cancel · Ctrl+Enter to save
              </span>
              <div className="flex items-center gap-1.5 ml-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(message.content);
                  }}
                  className="h-7 px-2.5 text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="xs"
                  onClick={handleSave}
                  disabled={!editContent.trim() || isStreaming}
                  className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs"
                >
                  Save & Resend
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group flex w-full flex-col items-end transition-opacity animate-in fade-in-50 duration-200">
        <div className="flex max-w-[85%] items-end gap-2 sm:max-w-[75%]">
          {/* Edit trigger on hover */}
          {!isStreaming && onEditSave && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md"
              aria-label="Edit message"
              title="Edit message"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}

          <div className="rounded-2xl rounded-tr-xs bg-emerald-600 px-4 py-2.5 text-sm text-white shadow-xs dark:bg-emerald-600 dark:text-white">
            {message.attachments && message.attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5 justify-start">
                {message.attachments.map((att) => (
                  <AttachmentChip
                    key={att.id}
                    attachment={att}
                    readOnly
                    className="bg-white/15 border-white/20 text-white dark:bg-white/10 dark:border-white/15 dark:text-white"
                  />
                ))}
              </div>
            )}
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
    <div className="group flex w-full flex-col items-start transition-opacity animate-in fade-in-50 duration-200">
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

      {/* Footer info: timestamp and message actions */}
      <div className="flex items-center gap-3 pl-10 mt-1">
        {formattedTime && (
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            {formattedTime}
          </span>
        )}

        {!message.isStreaming && threadId && (
          <MessageActions
            message={message}
            threadId={threadId}
            isLastAssistantMessage={isLastAssistantMessage}
            isStreaming={isStreaming}
            onRegenerate={onRegenerate}
          />
        )}
      </div>
    </div>
  );
}
