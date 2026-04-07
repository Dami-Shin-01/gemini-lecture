import Image from "next/image";
import { Clock } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  screenshot?: string;
  duration?: string;
}

interface StepByStepProps {
  steps: Step[];
}

export function StepByStep({ steps }: StepByStepProps) {
  return (
    <div className="my-6">
      {steps.map((step, i) => (
        <div key={step.number} className="relative flex gap-5 pb-8">
          {/* Vertical connector line */}
          {i < steps.length - 1 && (
            <div
              className="absolute left-5 top-12 bottom-0 w-px"
              style={{ backgroundColor: "var(--color-cream-dark)" }}
            />
          )}

          {/* Number badge */}
          <div className="relative z-10 flex shrink-0 flex-col items-center">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              {step.number}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-text-primary">{step.title}</h4>
              {step.duration && (
                <span className="flex items-center gap-1 rounded-full bg-cream-dark px-2 py-0.5 text-xs text-text-muted">
                  <Clock size={12} />
                  {step.duration}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              {step.description}
            </p>
            {step.screenshot && (
              <div className="mt-3 overflow-hidden rounded-md border border-cream-dark">
                <Image
                  src={step.screenshot}
                  alt={step.title}
                  width={800}
                  height={450}
                  className="h-auto w-full"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
