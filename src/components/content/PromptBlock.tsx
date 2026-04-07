"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface PromptBlockProps {
  title?: string;
  children: string;
}

export function PromptBlock({ title, children }: PromptBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg">
      {title && (
        <div className="bg-sidebar-hover px-4 py-2 text-xs font-medium text-text-muted">
          {title}
        </div>
      )}
      <div className="relative bg-sidebar-bg p-5">
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 rounded-md p-1.5 text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-white"
          aria-label="복사"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <pre className="whitespace-pre-wrap pr-10 font-mono text-sm leading-relaxed text-cream-dark">
          {children}
        </pre>
      </div>
    </div>
  );
}
