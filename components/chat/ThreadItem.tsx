'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Thread } from '@/types/chat';
import { useChatStore } from '@/store/chatStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  MoreHorizontal,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  MessageSquare,
} from 'lucide-react';

interface ThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function ThreadItem({ thread, isActive, onSelect }: ThreadItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(thread.title);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { renameThread, togglePin, deleteThread } = useChatStore();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveRename = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== thread.title) {
      renameThread(thread.id, trimmed);
    } else {
      setEditTitle(thread.title);
    }
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setEditTitle(thread.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelRename();
    }
  };

  const handleDelete = () => {
    deleteThread(thread.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div
        onClick={() => !isEditing && onSelect(thread.id)}
        className={cn(
          'group relative flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] transition-colors cursor-pointer select-none',
          isActive
            ? 'bg-sidebar-accent font-medium text-sidebar-foreground'
            : 'text-sidebar-foreground/85 hover:bg-surface hover:text-sidebar-foreground'
        )}
      >
        {thread.pinned ? (
          <Pin className="h-3.5 w-3.5 shrink-0 text-amber-500 fill-amber-500/20" />
        ) : (
          <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
        )}

        {isEditing ? (
          <div className="flex-1" onClick={(e) => e.stopPropagation()}>
            <Input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveRename}
              className="h-7 px-2 py-0 text-xs bg-background text-foreground ring-1 ring-ring"
            />
          </div>
        ) : (
          <span className="flex-1 truncate text-left text-[13px] leading-5">
            {thread.title}
          </span>
        )}

        {!isEditing && (
          <div
            className={cn(
              'shrink-0 transition-opacity',
              menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="h-6 w-6 rounded-md hover:bg-surface text-muted-foreground hover:text-foreground"
                  aria-label="Thread options"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => togglePin(thread.id)}>
                  {thread.pinned ? (
                    <>
                      <PinOff className="mr-2 h-3.5 w-3.5" />
                      <span>Unpin</span>
                    </>
                  ) : (
                    <>
                      <Pin className="mr-2 h-3.5 w-3.5" />
                      <span>Pin</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsEditing(true);
                    setEditTitle(thread.title);
                  }}
                >
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Thread</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{thread.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
