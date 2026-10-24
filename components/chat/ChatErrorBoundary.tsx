'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChatErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChatErrorBoundary caught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-background text-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3 ring-8 ring-destructive/5">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Something went wrong
          </h2>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
            An unexpected error occurred while rendering the conversation. You can retry safely without losing your thread data.
          </p>
          {this.state.error && (
            <pre className="mt-3 max-w-md overflow-x-auto rounded-lg border border-border bg-muted/50 p-2.5 text-left font-mono text-[11px] text-muted-foreground">
              {this.state.error.message}
            </pre>
          )}
          <Button
            type="button"
            onClick={this.handleRetry}
            size="sm"
            className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
