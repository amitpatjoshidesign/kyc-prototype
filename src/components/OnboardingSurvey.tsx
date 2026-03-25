"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Tell us about yourself",
    subtitle: "Help us personalise your Bridge experience",
    questions: [
      {
        key: "role",
        label: "What's your role?",
        options: ["Developer", "Product Manager", "CTO / Founder", "Business Analyst", "Other"],
      },
      {
        key: "use_case",
        label: "What are you building?",
        options: ["Bill payments (BBPS)", "KYC & Onboarding", "Account Aggregator", "UPI Payments", "Multiple / Not sure"],
      },
    ],
  },
  {
    title: "About your company",
    subtitle: "Help us understand your scale and stage",
    questions: [
      {
        key: "company_size",
        label: "Company size",
        options: ["1–10", "11–50", "51–200", "201–1000", "1000+"],
      },
      {
        key: "timeline",
        label: "Integration timeline",
        options: ["Just exploring", "Within 1 month", "1–3 months", "3–6 months+"],
      },
    ],
  },
  {
    title: "Technical details",
    subtitle: "Optional — helps us tailor docs and guides",
    questions: [
      {
        key: "tech_stack",
        label: "Primary tech stack",
        options: ["Node.js", "Python", "Java", "Go", ".NET", "Other"],
      },
      {
        key: "volume",
        label: "Expected monthly transactions",
        options: ["< 1,000", "1K – 10K", "10K – 100K", "100K+"],
      },
    ],
  },
];

type SurveyData = Record<string, string>;

interface Props {
  open: boolean;
  onComplete: (data: SurveyData) => void;
  onSkip: () => void;
}

export function OnboardingSurvey({ open, onComplete, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyData>({});
  const [done, setDone] = useState(false);

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function handleSelect(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleContinue() {
    if (isLast) {
      setDone(true);
      setTimeout(() => onComplete(answers), 1400);
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) onSkip();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[480px] p-0 gap-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Onboarding survey</DialogTitle>
        </VisuallyHidden>

        {done ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center min-h-[320px]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-5">
              <CheckCircle size={32} weight="duotone" className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Thanks for sharing!</h2>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              We'll use your answers to personalise your Bridge experience.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Header with step indicator */}
            <div className="px-8 pt-8 pb-6">
              {/* Step dots */}
              <div className="flex items-center gap-1.5 mb-7">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === step
                        ? "w-8 bg-primary"
                        : i < step
                        ? "w-4 bg-primary/40"
                        : "w-4 bg-border"
                    )}
                  />
                ))}
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                  {step + 1} / {STEPS.length}
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground">{currentStep.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{currentStep.subtitle}</p>
            </div>

            {/* Questions */}
            <div className="px-8 pb-6 space-y-6">
              {currentStep.questions.map((q) => (
                <div key={q.key}>
                  <p className="text-sm font-medium text-foreground mb-3">{q.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelect(q.key, opt)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm border transition-all",
                          answers[q.key] === opt
                            ? "border-primary bg-primary/8 text-primary font-medium ring-1 ring-primary/20"
                            : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground bg-background"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-8 pb-8 flex items-center justify-between border-t border-border/50 pt-5">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip survey
              </Button>
              <Button onClick={handleContinue} className="gap-1.5">
                {isLast ? "Submit" : "Continue"}
                {!isLast && <ArrowRight size={15} />}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
