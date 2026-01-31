import { Button } from "@/components/ui/button";

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  onPrevious?: () => void;
  onNext?: () => void;
  nextLabel?: string;
}

export default function StepHeader({
  currentStep,
  totalSteps,
  title,
  onPrevious,
  onNext,
  nextLabel,
}: StepHeaderProps) {
  const isLast = currentStep === totalSteps;

  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          Step {currentStep} of {totalSteps}
        </p>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="w-24"
          onClick={onPrevious}
          disabled={!onPrevious}
        >
          Previous
        </Button>
        <Button className="w-24" onClick={onNext}>
          {nextLabel || (isLast ? "Submit" : "Next")}
        </Button>
      </div>
    </div>
  );
}
