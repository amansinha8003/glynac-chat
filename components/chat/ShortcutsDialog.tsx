'use client';

import * as React from 'react';
import { HelpCircle, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SHORTCUTS = [
  {
    keys: ['Ctrl / ⌘', 'K'],
    description: 'Focus thread search in sidebar',
  },
  {
    keys: ['Ctrl / ⌘', 'Shift', 'O'],
    description: 'Start a new compliance thread',
  },
  {
    keys: ['Ctrl / ⌘', 'F'],
    description: 'Search messages in active thread',
  },
  {
    keys: ['Esc'],
    description: 'Close active search, dialog or popovers',
  },
  {
    keys: ['Enter'],
    description: 'Send message in chat input',
  },
  {
    keys: ['Shift', 'Enter'],
    description: 'Add line break in chat input',
  },
];

export function ShortcutsDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (?)"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <Command className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Keyboard Shortcuts</span>
          </DialogTitle>
        </DialogHeader>

        <div className="divide-y divide-border pt-2">
          {SHORTCUTS.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 text-xs first:pt-0 last:pb-0"
            >
              <span className="text-muted-foreground">{item.description}</span>
              <div className="flex items-center gap-1">
                {item.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-foreground shadow-2xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
