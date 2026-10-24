'use client';

import * as React from 'react';

export function ChatSkeleton() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground antialiased animate-pulse">
      {/* Sidebar Skeleton (Desktop) */}
      <aside className="hidden md:flex w-72 flex-col border-r border-border bg-sidebar shrink-0">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="space-y-1">
              <div className="h-3.5 w-24 rounded bg-muted" />
              <div className="h-2.5 w-16 rounded bg-muted" />
            </div>
          </div>
          <div className="h-6 w-6 rounded bg-muted" />
        </div>

        {/* New Chat & Search placeholders */}
        <div className="space-y-2 p-3">
          <div className="h-9 w-full rounded-md bg-muted" />
          <div className="h-8 w-full rounded-md bg-muted" />
        </div>

        {/* Thread list skeleton */}
        <div className="flex-1 space-y-3 px-3 py-2">
          <div className="h-2.5 w-16 rounded bg-muted" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg p-2 bg-muted/40">
                <div className="h-4 w-4 rounded bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-4/5 rounded bg-muted" />
                  <div className="h-2 w-1/2 rounded bg-muted/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background">
        {/* Header Skeleton */}
        <header className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-muted" />
            <div className="h-4 w-40 rounded bg-muted" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-muted" />
            <div className="h-8 w-8 rounded bg-muted" />
            <div className="hidden sm:block h-6 w-36 rounded-full bg-muted" />
          </div>
        </header>

        {/* Message Feed Skeleton */}
        <div className="flex-1 overflow-hidden p-6 space-y-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* User Message Skeleton */}
            <div className="flex justify-end">
              <div className="w-2/3 max-w-md rounded-2xl rounded-tr-xs bg-muted p-4 space-y-2">
                <div className="h-3 w-full rounded bg-muted-foreground/20" />
                <div className="h-3 w-4/5 rounded bg-muted-foreground/20" />
              </div>
            </div>

            {/* Assistant Message Skeleton */}
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-muted shrink-0" />
              <div className="flex-1 rounded-2xl rounded-tl-xs border border-border bg-card p-4 space-y-3">
                <div className="h-3.5 w-1/3 rounded bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-11/12 rounded bg-muted" />
                  <div className="h-3 w-4/5 rounded bg-muted" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-5 w-24 rounded-full bg-muted" />
                  <div className="h-5 w-28 rounded-full bg-muted" />
                </div>
              </div>
            </div>

            {/* Second User Message Skeleton */}
            <div className="flex justify-end">
              <div className="w-1/2 max-w-sm rounded-2xl rounded-tr-xs bg-muted p-3.5 space-y-2">
                <div className="h-3 w-full rounded bg-muted-foreground/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Input Skeleton */}
        <div className="p-4 border-t border-border">
          <div className="mx-auto max-w-3xl">
            <div className="h-20 w-full rounded-2xl border border-border bg-card" />
          </div>
        </div>
      </main>
    </div>
  );
}
