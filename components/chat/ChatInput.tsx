'use client';

import React, {
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  KeyboardEvent,
  DragEvent,
  ChangeEvent,
} from 'react';
import { Attachment } from '@/types/chat';
import { AttachmentChip } from './AttachmentChip';
import { Button } from '@/components/ui/button';
import { Send, Square, Paperclip, AlertCircle, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';

export interface ChatInputHandle {
  addFiles: (files: File[] | FileList) => void;
}

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
  onStopStreaming?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  ref?: React.Ref<ChatInputHandle>;
}

const ALLOWED_EXTENSIONS = ['pdf', 'txt', 'md', 'json', 'docx', 'png', 'jpg', 'jpeg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;

export function ChatInput({
  onSendMessage,
  onStopStreaming,
  isStreaming = false,
  disabled = false,
  ref,
}: ChatInputProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOverInput, setIsDragOverInput] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => {
      setErrorMessage(null);
    }, 4500);
  }, []);

  const validateAndAddFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      setAttachments((prev) => {
        if (prev.length + files.length > MAX_FILES) {
          showError(`Maximum ${MAX_FILES} attachments allowed.`);
          return prev;
        }

        const newAttachments: Attachment[] = [];

        for (const file of files) {
          const ext = file.name.split('.').pop()?.toLowerCase() || '';

          if (!ALLOWED_EXTENSIONS.includes(ext)) {
            showError(
              `Unsupported file: "${file.name}". Supported: .pdf, .txt, .md, .json, .docx, .png, .jpg`
            );
            return prev;
          }

          if (file.size > MAX_FILE_SIZE) {
            showError(`"${file.name}" exceeds the 10 MB limit.`);
            return prev;
          }

          const isDuplicate =
            prev.some((a) => a.name === file.name && a.size === file.size) ||
            newAttachments.some((a) => a.name === file.name && a.size === file.size);

          if (isDuplicate) {
            showError(`"${file.name}" is already attached.`);
            return prev;
          }

          newAttachments.push({
            id: nanoid(),
            name: file.name,
            size: file.size,
            type: file.type || ext,
          });
        }

        setErrorMessage(null);
        return [...prev, ...newAttachments];
      });
    },
    [showError]
  );

  useImperativeHandle(
    ref,
    () => ({
      addFiles: validateAndAddFiles,
    }),
    [validateAndAddFiles]
  );

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndAddFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSend = () => {
    const trimmed = content.trim();
    const hasAttachments = attachments.length > 0;

    if ((!trimmed && !hasAttachments) || disabled || isStreaming) return;

    // If only attachments are provided, use default prompt
    const messageContent =
      trimmed || 'Please review the attached document(s) for compliance issues.';

    onSendMessage(messageContent, hasAttachments ? attachments : undefined);
    setContent('');
    setAttachments([]);
    setErrorMessage(null);

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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    // Max ~6 lines at ~24px line height = ~150px
    target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
  };

  const handleInputDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverInput(true);
  };

  const handleInputDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverInput(false);
  };

  const handleInputDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverInput(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const canSend =
    !isStreaming && !disabled && (content.trim().length > 0 || attachments.length > 0);

  return (
    <div className="w-full border-t border-border bg-background/80 p-3 sm:p-4 backdrop-blur-md">
      <div className="mx-auto max-w-3xl">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md,.json,.docx,.png,.jpg,.jpeg"
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden="true"
        />

        {/* Inline Error Banner */}
        {errorMessage && (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs text-destructive animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-1.5 truncate">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="rounded p-0.5 text-destructive/70 hover:bg-destructive/20 hover:text-destructive"
              aria-label="Dismiss error"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Input Box Container */}
        <div
          onDragOver={handleInputDragOver}
          onDragLeave={handleInputDragLeave}
          onDrop={handleInputDrop}
          className={cn(
            'relative flex flex-col rounded-2xl border bg-card shadow-2xs transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20',
            isDragOverInput
              ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-500/5'
              : 'border-border'
          )}
        >
          {/* Attachment Chips Header */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 border-b border-border/80 px-3.5 pt-3 pb-2">
              <AnimatePresence>
                {attachments.map((att) => (
                  <AttachmentChip
                    key={att.id}
                    attachment={att}
                    onRemove={handleRemoveAttachment}
                  />
                ))}
              </AnimatePresence>
              <span className="text-[11px] text-muted-foreground ml-1">
                {attachments.length}/{MAX_FILES}
              </span>
            </div>
          )}

          {/* Textarea Area */}
          <div className="relative flex items-end">
            {/* Paperclip Attach Button */}
            <div className="pb-2.5 pl-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isStreaming || disabled || attachments.length >= MAX_FILES}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:hover:bg-transparent"
                aria-label="Attach documents"
                title="Attach documents (.pdf, .txt, .md, .json, .docx, .png, .jpg)"
              >
                <Paperclip className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Auto-growing Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={content}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              disabled={disabled || isStreaming}
              placeholder={
                isStreaming
                  ? 'AI is generating compliance analysis...'
                  : attachments.length > 0
                  ? 'Add instructions for attached files, or press Enter to review...'
                  : 'Ask about compliance policies, regulations, or draft a disclosure... (Enter to send)'
              }
              className="min-h-[46px] max-h-[150px] w-full resize-none bg-transparent px-3 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60 leading-relaxed"
            />

            {/* Right Action: Send or Stop Button */}
            <div className="pb-2.5 pr-2.5">
              {isStreaming ? (
                <Button
                  type="button"
                  size="icon-sm"
                  onClick={onStopStreaming}
                  className="h-9 w-9 rounded-xl bg-primary text-primary-foreground shadow-2xs transition hover:bg-primary/90"
                  aria-label="Stop generation"
                >
                  <Square className="h-3.5 w-3.5 fill-current" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="icon-sm"
                  disabled={!canSend}
                  onClick={handleSend}
                  className="h-9 w-9 rounded-xl bg-emerald-600 text-white shadow-2xs transition hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Guidance */}
        <div className="mt-1.5 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
          <span>Max 5 files (10 MB each) · PDF, DOCX, TXT, JSON, MD, PNG, JPG</span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <span>Shift + Enter for new line</span>
          </span>
        </div>
      </div>
    </div>
  );
}
