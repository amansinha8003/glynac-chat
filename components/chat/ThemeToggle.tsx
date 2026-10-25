'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon-xs"
        className="h-8 w-8 text-muted-foreground"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="h-8 w-8 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors duration-150 rounded-lg"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 bg-popover border-border">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex items-center justify-between cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-3.5 w-3.5" />
            <span>Light</span>
          </div>
          {theme === 'light' && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="flex items-center justify-between cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-3.5 w-3.5" />
            <span>Dark</span>
          </div>
          {theme === 'dark' && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="flex items-center justify-between cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2">
            <Laptop className="h-3.5 w-3.5" />
            <span>System</span>
          </div>
          {theme === 'system' && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
