import { CaretDown, CaretUp, Check, CheckCircle, CircleDashed, CircleHalf } from "@phosphor-icons/react/dist/ssr";

export interface SubStep {
  label: string;
  completed: number;
  total: number;
  active?: boolean;
}

export interface Step {
  label: string;
  completed?: boolean;
  active?: boolean;
  hasSubSteps?: boolean;
  subSteps?: SubStep[];
}

interface SidebarProps {
  steps: Step[];
}

export default function Sidebar({ steps }: SidebarProps) {
  let stepNumber = 0;

  return (
    <aside className="hidden md:block w-[268px] shrink-0 p-4">
      <ul className="space-y-3">
        {steps.map((step) => {
          stepNumber++;

          return (
            <li key={step.label}>
              {/* Main step */}
              <div
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${
                  step.active ? "font-medium text-foreground" : "text-foreground"
                }`}
              >
                {step.completed ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600">
                    <Check size={12} weight="bold" className="text-white" />
                  </span>
                ) : (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                    {stepNumber}
                  </span>
                )}
                <span className="flex-1 text-sm">{step.label}</span>
                {step.hasSubSteps && (
                  step.subSteps ? (
                    <CaretUp size={12} weight="bold" className="shrink-0 text-muted-foreground" />
                  ) : (
                    <CaretDown size={12} weight="bold" className="shrink-0 text-muted-foreground" />
                  )
                )}
              </div>

              {/* Sub-steps */}
              {step.subSteps && (
                <ul className="ml-2.5 pl-5 pt-3 pb-0">
                  {step.subSteps.map((sub) => (
                    <li
                      key={sub.label}
                      className={`rounded-md px-3 py-3 text-sm ${
                        sub.active
                          ? "bg-sidebar-accent font-medium text-foreground"
                          : "text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {sub.completed === sub.total ? (
                          <CheckCircle
                            size={16}
                            weight="fill"
                            className="shrink-0 text-foreground"
                          />
                        ) : sub.completed > 0 ? (
                          <CircleHalf
                            size={16}
                            weight="fill"
                            className="shrink-0 text-foreground"
                          />
                        ) : (
                          <CircleDashed
                            size={16}
                            className="shrink-0 text-foreground"
                          />
                        )}
                        {sub.label}
                      </div>
                      <div
                        className={`text-xs mt-1 ml-6 ${
                          "text-muted-foreground"
                        }`}
                      >
                        {sub.completed} of {sub.total} completed
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

interface MobileStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
}

export function MobileStepIndicator({ currentStep, totalSteps, stepTitle }: MobileStepIndicatorProps) {
  return (
    <div className="flex md:hidden items-center gap-3 px-4 py-3 border-b border-border">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
        {currentStep}
      </span>
      <span className="text-sm font-medium text-foreground">{stepTitle}</span>
      <span className="ml-auto text-xs text-muted-foreground">Step {currentStep} of {totalSteps}</span>
    </div>
  );
}
