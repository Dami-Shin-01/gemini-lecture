import type { MDXComponents } from "mdx/types";
import {
  HighlightBox,
  PromptBlock,
  ComparisonTable,
  BeforeAfter,
  ConceptCard,
  StepByStep,
  TechTree,
  ImageFigure,
} from "@/components/content";

const components: MDXComponents = {
  // Custom content components
  HighlightBox,
  PromptBlock,
  ComparisonTable,
  BeforeAfter,
  ConceptCard,
  StepByStep,
  TechTree,
  ImageFigure,

  // Styled HTML elements
  h1: (props) => (
    <h1
      className="mb-4 text-[1.75rem] font-bold leading-tight text-text-primary"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mb-3 mt-10 text-[1.375rem] font-semibold leading-snug text-text-primary"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-2 mt-6 text-lg font-semibold text-text-primary"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mb-4 leading-relaxed text-text-secondary" {...props} />
  ),
  ul: (props) => (
    <ul className="mb-4 list-disc space-y-1 pl-6 text-text-secondary" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-4 list-decimal space-y-1 pl-6 text-text-secondary" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => (
    <strong className="font-semibold text-text-primary" {...props} />
  ),
  hr: () => <hr className="my-8 border-cream-dark" />,
  a: (props) => (
    <a
      className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-cream-dark">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="bg-cream-dark px-4 py-3 text-left font-semibold text-text-primary"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-t border-cream-dark px-4 py-3 text-text-secondary"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-cream-dark px-1.5 py-0.5 text-[0.9em] font-semibold text-accent"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-4 border-cream-dark pl-4 italic text-text-muted"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
