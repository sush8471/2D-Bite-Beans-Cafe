"use client";

import * as React from "react";
import { Lightbulb, X } from "lucide-react";

export interface AdminTipBannerProps {
  id: string; // Unique key for localStorage
  title?: string;
  children: React.ReactNode;
}

export function AdminTipBanner({
  id,
  title = "Quick Tip",
  children,
}: AdminTipBannerProps) {
  const [dismissed, setDismissed] = React.useState(true);

  React.useEffect(() => {
    try {
      const isDismissed = localStorage.getItem(`tip_dismissed_${id}`);
      if (!isDismissed) {
        setDismissed(false);
      }
    } catch {
      setDismissed(false);
    }
  }, [id]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(`tip_dismissed_${id}`, "true");
    } catch {
      // Ignore localStorage errors
    }
  };

  if (dismissed) return null;

  return (
    <div className="relative mb-5 flex items-start gap-3 rounded-lg border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
      <Lightbulb className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
      <div className="flex-1 pr-6 leading-relaxed">
        <strong className="font-semibold block mb-0.5 text-amber-900 dark:text-amber-300">
          {title}
        </strong>
        {children}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2.5 top-2.5 rounded p-1 text-amber-700/70 hover:bg-amber-100 hover:text-amber-900 dark:text-amber-400 dark:hover:bg-amber-900/40 transition-colors"
        aria-label="Dismiss tip"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

