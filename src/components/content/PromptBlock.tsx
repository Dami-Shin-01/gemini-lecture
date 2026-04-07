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
    <div className="my-6 overflow-hidden rounded-xl border border-cream-dark shadow-sm">
      {title && (
        <div
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wide"
          style={{ backgroundColor: "var(--color-accent)", color: "white" }}
        >
          <span className="opacity-70">&#9654;</span>
          {title}
        </div>
      )}
      <div className="relative bg-white px-6 py-5">
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 rounded-md p-1.5 text-text-muted transition-colors hover:bg-cream-dark hover:text-text-primary"
          aria-label="복사"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <pre className="whitespace-pre-wrap pr-10 text-[0.9rem] leading-[1.9] text-text-primary">
          {children}
        </pre>
      </div>
    </div>
  );
}
