'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter, createElement } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { escapeRegExp } from '@/lib/searchMessages';

interface CodeBlockProps {
  language?: string;
  value: string;
  searchQuery?: string;
  activeMatchIndex?: number;
  getCodeMatchIndex?: () => number;
}

export function CodeBlock({
  language,
  value,
  searchQuery,
  activeMatchIndex,
  getCodeMatchIndex,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const hasSearchMatch =
    Boolean(searchQuery?.trim()) &&
    value.toLowerCase().includes(searchQuery!.trim().toLowerCase());

  const customRenderer = hasSearchMatch && getCodeMatchIndex
    ? ({ rows, stylesheet, useInlineStyles }: { rows: unknown[]; stylesheet: unknown; useInlineStyles: boolean }) => {
        const query = searchQuery!.trim();
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');

        // Transform AST nodes to inject <mark> elements for search matches
        const transformNode = (node: unknown): unknown => {
          const n = node as { type?: string; value?: string; children?: unknown[] };
          if (n.type === 'text' && typeof n.value === 'string') {
            const text = n.value;
            if (!text.toLowerCase().includes(query.toLowerCase())) {
              return node;
            }
            const parts = text.split(regex);
            return parts.map((part) => {
              if (part.toLowerCase() === query.toLowerCase()) {
                const matchIdx = getCodeMatchIndex();
                const isActive = matchIdx === activeMatchIndex;
                return {
                  type: 'element',
                  tagName: 'mark',
                  properties: {
                    id: `search-match-${matchIdx}`,
                    'data-search-match-index': matchIdx,
                    className: [
                      'rounded-2xs px-0.5 transition-colors',
                      isActive
                        ? 'bg-amber-400 text-zinc-950 font-semibold ring-2 ring-amber-500/80 dark:bg-amber-400 dark:text-zinc-950'
                        : 'bg-yellow-200/80 text-zinc-900 dark:bg-amber-500/30 dark:text-amber-200',
                    ],
                  },
                  children: [{ type: 'text', value: part }],
                };
              }
              return { type: 'text', value: part };
            });
          }

          if (Array.isArray(n.children)) {
            return {
              ...n,
              children: n.children.flatMap(transformNode),
            };
          }

          return node;
        };

        const transformedRows = rows.map((row) => {
          const r = row as { type?: string; children?: unknown[] };
          return {
            ...r,
            type: r.type || 'element',
            children: Array.isArray(r.children) ? r.children.flatMap(transformNode) : [],
          };
        });

        return (
          <code>
            {transformedRows.map((node, i) =>
              createElement({
                node: node as never,
                stylesheet: stylesheet as never,
                useInlineStyles,
                key: `code-row-${i}`,
              })
            )}
          </code>
        );
      }
    : undefined;

  return (
    <div className="relative my-3 overflow-hidden rounded-xl border border-zinc-800 bg-[#171717] text-xs shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/80 px-3.5 py-1.5 text-zinc-400">
        <span className="font-mono text-[11px] font-medium tracking-wider uppercase text-zinc-400">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto text-[13px] leading-relaxed font-mono">
        <SyntaxHighlighter
          language={language || 'text'}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: 1.6,
          }}
          wrapLongLines={false}
          renderer={customRenderer}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
