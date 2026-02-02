import { Button } from "@/components/ui/button";

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  hidePrevious?: boolean;
}

export default function StepHeader({
  currentStep,
  totalSteps,
  title,
  subtitle,
  onPrevious,
  onNext,
  nextLabel,
  hidePrevious,
}: StepHeaderProps) {
  const isLast = currentStep === totalSteps;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {subtitle || `Step ${currentStep} of ${totalSteps}`}
        </p>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card p-4 md:static md:border-t-0 md:p-0 md:bg-transparent flex items-center gap-3 w-full md:w-auto">
        {!hidePrevious && (
          <Button
            variant="outline"
            className="flex-1 md:flex-none md:w-24"
            onClick={onPrevious}
            disabled={!onPrevious}
          >
            Previous
          </Button>
        )}
        <Button className={hidePrevious ? "w-full md:w-auto md:px-6" : "flex-1 md:flex-none md:w-24"} onClick={onNext}>
          {nextLabel || (isLast ? "Submit" : "Next")}
        </Button>
      </div>
    </div>
  );
}
