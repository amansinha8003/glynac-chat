'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { CitationPill } from './CitationPill';
import { cleanStreamingContent } from '@/lib/citations';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

function renderTextWithCitations(text: string): React.ReactNode {
  if (!text || typeof text !== 'string') return text;
  if (!text.includes('[[cite:')) return text;

  const parts = text.split(/(\[\[cite:[a-zA-Z0-9_-]+\]\])/g);
  return parts.map((part, index) => {
    const match = /^\[\[cite:([a-zA-Z0-9_-]+)\]\]$/.exec(part);
    if (match) {
      const citeId = match[1];
      return <CitationPill key={`${citeId}-${index}`} citationId={citeId} />;
    }
    return part;
  });
}

function processChildrenWithCitations(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return renderTextWithCitations(child);
    }
    if (React.isValidElement(child) && (child.props as { children?: React.ReactNode }).children) {
      // Do not process code elements
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

export function MarkdownRenderer({ content, isStreaming, className }: MarkdownRendererProps) {
  const displayContent = cleanStreamingContent(content, isStreaming);

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
                />
              );
            }

            return (
              <code
                className="rounded-md border border-zinc-200/70 bg-zinc-100 px-1.5 py-0.5 font-mono text-[12.5px] font-medium text-emerald-700 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-emerald-400"
                {...props}
              >
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="my-3.5 w-full overflow-x-auto rounded-xl border border-zinc-200/80 shadow-2xs dark:border-zinc-800">
                <table className="w-full min-w-[460px] border-collapse text-left text-xs">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="border-b border-zinc-200 bg-zinc-100/90 font-semibold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-100">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return (
              <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70 [&>tr:nth-child(even)]:bg-zinc-50/70 dark:[&>tr:nth-child(even)]:bg-zinc-900/40">
                {children}
              </tbody>
            );
          },
          tr({ children }) {
            return (
              <tr className="transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30">
                {children}
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="px-3.5 py-2.5 text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {processChildrenWithCitations(children)}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3.5 py-2.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                {processChildrenWithCitations(children)}
              </td>
            );
          },
          ul({ children }) {
            return (
              <ul className="my-2.5 ml-5 list-disc space-y-1.5 text-sm text-zinc-800 dark:text-zinc-200">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="my-2.5 ml-5 list-decimal space-y-1.5 text-sm text-zinc-800 dark:text-zinc-200">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="pl-0.5 leading-relaxed">{processChildrenWithCitations(children)}</li>;
          },
          strong({ children }) {
            return (
              <strong className="font-semibold text-zinc-950 dark:text-zinc-50">
                {processChildrenWithCitations(children)}
              </strong>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-3 rounded-r-lg border-l-2 border-emerald-500 bg-emerald-50/5 py-1.5 pr-3 pl-3.5 text-xs italic text-zinc-600 dark:text-zinc-400">
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
              <p className="my-2 leading-relaxed text-zinc-800 first:mt-0 last:mb-0 dark:text-zinc-200">
                {processChildrenWithCitations(children)}
              </p>
            );
          },
          h1({ children }) {
            return (
              <h1 className="mt-4 mb-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {processChildrenWithCitations(children)}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="mt-3.5 mb-2 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {processChildrenWithCitations(children)}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="mt-3 mb-1.5 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {processChildrenWithCitations(children)}
              </h3>
            );
          },
          hr() {
            return <hr className="my-4 border-zinc-200 dark:border-zinc-800" />;
          },
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  );
}
