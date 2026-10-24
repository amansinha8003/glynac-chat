'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Message } from '@/types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CitationPill } from './CitationPill';
import { AttachmentChip } from './AttachmentChip';
import { MessageActions } from './MessageActions';
import { getUniqueCitations } from '@/lib/citations';
import { SearchMatch, escapeRegExp } from '@/lib/searchMessages';
import { Button } from '@/components/ui/button';
import { format, isValid } from 'date-fns';
import { Bot, User, Bookmark, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  threadId?: string;
  isLastAssistantMessage?: boolean;
  isStreaming?: boolean;
  searchQuery?: string;
  activeMatchIndex?: number;
  contentMatches?: SearchMatch[];
  attachmentMatches?: SearchMatch[];
  onRegenerate?: () => void;
  onEditSave?: (messageId: string, newContent: string) => void;
}

export function MessageBubble({
  message,
  threadId,
  isLastAssistantMessage = false,
  isStreaming = false,
  searchQuery,
  activeMatchIndex,
  contentMatches,
  attachmentMatches,
  onRegenerate,
  onEditSave,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const shouldReduceMotion = useReducedMotion();
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

  let contentCursor = 0;
  const getContentMatchIndex = () => {
    if (!contentMatches || contentCursor >= contentMatches.length) return -1;
    return contentMatches[contentCursor++].matchIndex;
  };

  const createAttachmentMatchGetter = (attId: string) => {
    const attMatches = attachmentMatches?.filter((m) => m.attachmentId === attId) || [];
    let attCursor = 0;
    return () => {
      if (attCursor >= attMatches.length) return -1;
      return attMatches[attCursor++].matchIndex;
    };
  };

  const renderUserContent = () => {
    const trimmed = searchQuery?.trim();
    if (!trimmed || !contentMatches?.length) {
      return message.content;
    }
    const regex = new RegExp(`(${escapeRegExp(trimmed)})`, 'gi');
    const parts = message.content.split(regex);
    return parts.map((part, index) => {
      if (part.toLowerCase() === trimmed.toLowerCase()) {
        const matchIdx = getContentMatchIndex();
        const isActive = matchIdx === activeMatchIndex;
        return (
          <mark
            key={index}
            id={`search-match-${matchIdx}`}
            data-search-match-index={matchIdx}
            className={cn(
              'rounded-2xs px-0.5 transition-colors',
              isActive
                ? 'bg-amber-400 text-zinc-950 font-semibold ring-2 ring-amber-500/80 dark:bg-amber-400 dark:text-zinc-950'
                : 'bg-yellow-200/80 text-zinc-900 dark:bg-amber-500/30 dark:text-amber-200'
            )}
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  if (isUser) {
    if (isEditing) {
      return (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="flex w-full flex-col items-end"
        >
          <div className="w-full max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs border border-emerald-500 bg-card p-3.5 shadow-md">
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
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2">
              <span className="text-[10px] text-muted-foreground hidden sm:inline">
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
                  className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
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
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="group flex w-full flex-col items-end"
      >
        <div className="flex max-w-[85%] items-end gap-2 sm:max-w-[75%]">
          {!isStreaming && onEditSave && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setEditContent(message.content);
              }}
              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Edit message"
              title="Edit message"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}

          <div className="rounded-2xl rounded-tr-xs bg-emerald-600 px-4 py-2.5 text-sm text-white shadow-xs max-w-full">
            {message.attachments && message.attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5 justify-start">
                {message.attachments.map((att) => (
                  <AttachmentChip
                    key={att.id}
                    attachment={att}
                    readOnly
                    className="bg-white/15 border-white/20 text-white dark:bg-white/10 dark:border-white/15 dark:text-white"
                    searchQuery={searchQuery}
                    activeMatchIndex={activeMatchIndex}
                    getAttachmentMatchIndex={createAttachmentMatchGetter(att.id)}
                  />
                ))}
              </div>
            )}
            <p className="whitespace-pre-wrap leading-relaxed break-words">{renderUserContent()}</p>
          </div>
          <div className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 sm:flex dark:bg-emerald-950 dark:text-emerald-300">
            <User className="h-3.5 w-3.5" />
          </div>
        </div>
        {formattedTime && (
          <span className="mt-1 px-1 text-[11px] font-medium text-muted-foreground">
            {formattedTime}
          </span>
        )}
      </motion.div>
    );
  }

  const uniqueCitations = !isUser && message.content ? getUniqueCitations(message.content) : [];

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="group flex w-full flex-col items-start"
    >
      <div className="flex max-w-[95%] items-start gap-2.5 sm:max-w-[90%] md:max-w-[85%] w-full">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-2xs dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400">
          <Bot className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 rounded-2xl rounded-tl-xs border border-border bg-card px-4 py-3 shadow-2xs text-card-foreground">
          {message.isStreaming && !message.content ? (
            <div className="flex items-center gap-1.5 py-1 px-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" />
            </div>
          ) : (
            <div className="relative break-words">
              <MarkdownRenderer
                content={message.content}
                isStreaming={message.isStreaming}
                searchQuery={searchQuery}
                activeMatchIndex={activeMatchIndex}
                getContentMatchIndex={getContentMatchIndex}
              />
              {message.isStreaming && (
                <span
                  className="inline-block h-3.5 w-1.5 translate-y-0.5 ml-1 rounded-2xs bg-emerald-500 animate-pulse align-middle"
                  aria-hidden="true"
                />
              )}

              {/* Sources footer for assistant messages */}
              {uniqueCitations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-muted-foreground">
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
          <span className="text-[11px] font-medium text-muted-foreground">
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
    </motion.div>
  );
}
