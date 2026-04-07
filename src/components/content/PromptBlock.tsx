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
        <div className="bg-[#2A2A2A] px-4 py-2 text-xs font-medium text-[#9E9690]">
          {title}
        </div>
      )}
      <div className="relative bg-[#1E1E1E] p-5">
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 rounded-md p-1.5 text-[#9E9690] transition-colors hover:bg-[#2A2A2A] hover:text-white"
          aria-label="복사"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <pre className="whitespace-pre-wrap pr-10 font-mono text-sm leading-relaxed text-[#E0D8D0]">
          {children}
        </pre>
      </div>
    </div>
  );
}
