'use client';

import { useState } from 'react';
import { Message } from '@/types/chat';
import { useChatStore } from '@/store/chatStore';
import { formatContentForCopy } from '@/lib/citations';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageActionsProps {
  message: Message;
  threadId: string;
  isLastAssistantMessage?: boolean;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  className?: string;
}

export function MessageActions({
  message,
  threadId,
  isLastAssistantMessage = false,
  isStreaming = false,
  onRegenerate,
  className,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const setFeedback = useChatStore((state) => state.setFeedback);

  const handleCopy = async () => {
    try {
      const textToCopy = formatContentForCopy(message.content);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(threadId, message.id, type);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          'flex items-center gap-1 mt-1 text-muted-foreground opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity',
          className
        )}
      >
        {/* Copy Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label={copied ? 'Copied response' : 'Copy response'}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4}>
            {copied ? 'Copied!' : 'Copy'}
          </TooltipContent>
        </Tooltip>

        {/* Thumbs Up Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => handleFeedback('up')}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                message.feedback === 'up'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'hover:bg-muted hover:text-foreground'
              )}
              aria-label={message.feedback === 'up' ? 'Remove helpful rating' : 'Good response'}
            >
              <ThumbsUp
                className={cn(
                  'h-3.5 w-3.5',
                  message.feedback === 'up' && 'fill-emerald-500/20'
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4}>
            {message.feedback === 'up' ? 'Helpful (active)' : 'Helpful'}
          </TooltipContent>
        </Tooltip>

        {/* Thumbs Down Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => handleFeedback('down')}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                message.feedback === 'down'
                  ? 'bg-destructive/10 text-destructive'
                  : 'hover:bg-muted hover:text-foreground'
              )}
              aria-label={message.feedback === 'down' ? 'Remove unhelpful rating' : 'Bad response'}
            >
              <ThumbsDown
                className={cn(
                  'h-3.5 w-3.5',
                  message.feedback === 'down' && 'fill-destructive/20'
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4}>
            {message.feedback === 'down' ? 'Unhelpful (active)' : 'Unhelpful'}
          </TooltipContent>
        </Tooltip>

        {/* Regenerate Button (only for last assistant message) */}
        {isLastAssistantMessage && onRegenerate && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onRegenerate}
                disabled={isStreaming}
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40 disabled:hover:bg-transparent"
                aria-label="Regenerate response"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4}>
              Regenerate
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
