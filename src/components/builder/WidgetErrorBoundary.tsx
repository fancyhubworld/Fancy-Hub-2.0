"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  widgetType?: string;
  widgetId?: string;
  pageSlug?: string;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[WidgetErrorBoundary] Error caught in widget '${this.props.widgetType || "unknown"}':`, error, errorInfo);
    // Send background error telemetry to admin log endpoint if available
    try {
      fetch("/api/admin/widget-errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widgetType: this.props.widgetType,
          widgetId: this.props.widgetId,
          pageSlug: this.props.pageSlug,
          errorMessage: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {}
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-dashed border-amber-800/60 my-2 text-center text-xs text-amber-300 flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="font-bold">This section is momentarily unavailable</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-md">
            Our engineers have been notified. The rest of the page remains fully functional.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
