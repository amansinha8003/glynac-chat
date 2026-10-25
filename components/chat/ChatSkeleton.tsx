'use client';

import * as React from 'react';

export function ChatSkeleton() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground antialiased animate-pulse">
      {/* Sidebar Skeleton (Desktop) */}
      <aside className="hidden md:flex w-72 flex-col border-r border-sidebar-border bg-sidebar shrink-0">
        {/* Header */}
        <div className="flex h-13 items-center justify-between border-b border-sidebar-border px-3.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-surface" />
            <div className="h-3.5 w-24 rounded bg-surface" />
          </div>
          <div className="h-6 w-6 rounded bg-surface" />
        </div>

        {/* New Chat & Search placeholders */}
        <div className="space-y-1.5 p-3">
          <div className="h-9 w-full rounded-lg bg-surface" />
          <div className="h-8 w-full rounded-lg bg-surface" />
        </div>

        {/* Thread list skeleton */}
        <div className="flex-1 space-y-3 px-3 py-2">
          <div className="h-2.5 w-16 rounded bg-surface" />
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 bg-surface/60">
                <div className="h-4 w-4 rounded bg-surface" />
                <div className="h-3 w-4/5 rounded bg-surface" />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background">
        {/* Header Skeleton */}
        <header className="flex h-13 items-center justify-between border-b border-border/80 px-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-surface" />
            <div className="h-3.5 w-40 rounded bg-surface" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-8 w-8 rounded-lg bg-surface" />
            <div className="h-8 w-8 rounded-lg bg-surface" />
            <div className="hidden lg:block h-6 w-36 rounded-full bg-surface" />
          </div>
        </header>

        {/* Message Feed Skeleton */}
        <div className="flex-1 overflow-hidden p-6 space-y-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* User Message Skeleton */}
            <div className="flex justify-end">
              <div className="w-2/3 max-w-md rounded-3xl bg-surface border border-border/60 p-4 space-y-2">
                <div className="h-3 w-full rounded bg-muted-foreground/20" />
                <div className="h-3 w-4/5 rounded bg-muted-foreground/20" />
              </div>
            </div>

            {/* Assistant Message Skeleton - No Bubble */}
            <div className="flex items-start gap-3.5 max-w-[720px]">
              <div className="h-7 w-7 rounded-full bg-surface shrink-0" />
              <div className="flex-1 space-y-2.5 pt-1">
                <div className="h-3 w-full rounded-md bg-surface" />
                <div className="h-3 w-11/12 rounded-md bg-surface" />
                <div className="h-3 w-4/5 rounded-md bg-surface" />
                <div className="flex gap-2 pt-1">
                  <div className="h-5 w-24 rounded-full bg-surface" />
                  <div className="h-5 w-28 rounded-full bg-surface" />
                </div>
              </div>
            </div>

            {/* Second User Message Skeleton */}
            <div className="flex justify-end">
              <div className="w-1/2 max-w-sm rounded-3xl bg-surface border border-border/60 p-3.5 space-y-2">
                <div className="h-3 w-full rounded bg-muted-foreground/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Composer Skeleton - Floating 3xl container */}
        <div className="px-4 pb-4">
          <div className="mx-auto max-w-3xl">
            <div className="h-14 w-full rounded-3xl border border-border bg-surface/70" />
          </div>
        </div>
      </main>
    </div>
  );
}
