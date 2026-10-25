'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { CitationPill } from './CitationPill';
import { cleanStreamingContent } from '@/lib/citations';
import { escapeRegExp } from '@/lib/searchMessages';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
  searchQuery?: string;
  activeMatchIndex?: number;
  getContentMatchIndex?: () => number;
}

export function MarkdownRenderer({
  content,
  isStreaming,
  className,
  searchQuery,
  activeMatchIndex,
  getContentMatchIndex,
}: MarkdownRendererProps) {
  const displayContent = cleanStreamingContent(content, isStreaming);

  const trimmedQuery = searchQuery?.trim();
  const queryRegex = trimmedQuery
    ? new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'gi')
    : null;

  function renderTextWithHighlightAndCitations(text: string): React.ReactNode {
    if (!text || typeof text !== 'string') return text;

    // First split by citation tokens
    if (text.includes('[[cite:')) {
      const parts = text.split(/(\[\[cite:[a-zA-Z0-9_-]+\]\])/g);
      return parts.map((part, index) => {
        const match = /^\[\[cite:([a-zA-Z0-9_-]+)\]\]$/.exec(part);
        if (match) {
          const citeId = match[1];
          return <CitationPill key={`${citeId}-${index}`} citationId={citeId} />;
        }
        return renderHighlightedSubstrings(part, index);
      });
    }

    return renderHighlightedSubstrings(text, 0);
  }

  function renderHighlightedSubstrings(str: string, baseIndex: number): React.ReactNode {
    if (!queryRegex || !getContentMatchIndex || !str.toLowerCase().includes(trimmedQuery!.toLowerCase())) {
      return str;
    }

    const segments = str.split(queryRegex);
    return segments.map((seg, i) => {
      if (seg.toLowerCase() === trimmedQuery!.toLowerCase()) {
        const matchIdx = getContentMatchIndex();
        const isActive = matchIdx === activeMatchIndex;
        return (
          <mark
            key={`highlight-${baseIndex}-${i}-${matchIdx}`}
            id={`search-match-${matchIdx}`}
            data-search-match-index={matchIdx}
            className={cn(
              'rounded-2xs px-0.5 transition-colors',
              isActive
                ? 'bg-amber-400 text-zinc-950 font-semibold ring-2 ring-amber-500/80 dark:bg-amber-400 dark:text-zinc-950'
                : 'bg-yellow-200/80 text-zinc-900 dark:bg-amber-500/30 dark:text-amber-200'
            )}
          >
            {seg}
          </mark>
        );
      }
      return seg;
    });
  }

  function processChildrenWithCitations(children: React.ReactNode): React.ReactNode {
    return React.Children.map(children, (child) => {
      if (typeof child === 'string') {
        return renderTextWithHighlightAndCitations(child);
      }
      if (React.isValidElement(child) && (child.props as { children?: React.ReactNode }).children) {
        if (child.type === 'code') {
          return child;
        }
        const element = child as React.ReactElement<{ children?: React.ReactNode }>;
        return React.cloneElement(
          element,
          undefined,
          processChildrenWithCitations(element.props.children)
        );
      }
      return child;
    });
  }

  return (
    <div className={cn('prose-sm max-w-none break-words text-sm leading-relaxed', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const stringChildren = String(children);
            const isMultiline = stringChildren.includes('\n');

            if (match || isMultiline) {
              return (
                <CodeBlock
                  language={match ? match[1] : ''}
                  value={stringChildren.replace(/\n$/, '')}
                  searchQuery={searchQuery}
                  activeMatchIndex={activeMatchIndex}
                  getCodeMatchIndex={getContentMatchIndex}
                />
              );
            }

            return (
              <code
                className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[13px] text-foreground"
                {...props}
              >
                {processChildrenWithCitations(children)}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="my-3.5 w-full overflow-x-auto rounded-xl border border-border shadow-2xs">
                <table className="w-full min-w-[460px] border-collapse text-left text-xs">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="border-b border-border bg-surface font-medium text-foreground">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return (
              <tbody className="divide-y divide-border/60 [&>tr:nth-child(even)]:bg-surface/30">
                {children}
              </tbody>
            );
          },
          tr({ children }) {
            return (
              <tr className="transition-colors hover:bg-surface/60">
                {children}
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {processChildrenWithCitations(children)}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3.5 py-2.5 text-xs leading-relaxed text-foreground">
                {processChildrenWithCitations(children)}
              </td>
            );
          },
          ul({ children }) {
            return (
              <ul className="my-2.5 ml-5 list-disc space-y-1.5 text-[15px] text-foreground">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="my-2.5 ml-5 list-decimal space-y-1.5 text-[15px] text-foreground">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="pl-0.5 leading-relaxed">{processChildrenWithCitations(children)}</li>;
          },
          strong({ children }) {
            return (
              <strong className="font-semibold text-foreground">
                {processChildrenWithCitations(children)}
              </strong>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-3 rounded-r-lg border-l-2 border-emerald-500 bg-surface/40 py-2 pr-3 pl-3.5 text-xs italic text-muted-foreground">
                {processChildrenWithCitations(children)}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 underline underline-offset-3 transition hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                {children}
              </a>
            );
          },
          p({ children }) {
            return (
              <p className="my-2 leading-relaxed text-foreground/95 first:mt-0 last:mb-0">
                {processChildrenWithCitations(children)}
              </p>
            );
          },
          h1({ children }) {
            return (
              <h1 className="mt-4 mb-2 text-lg font-bold tracking-tight text-foreground">
                {processChildrenWithCitations(children)}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="mt-3.5 mb-2 text-base font-semibold tracking-tight text-foreground">
                {processChildrenWithCitations(children)}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="mt-3 mb-1.5 text-sm font-semibold tracking-tight text-foreground">
                {processChildrenWithCitations(children)}
              </h3>
            );
          },
          hr() {
            return <hr className="my-4 border-border" />;
          },
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  );
}
