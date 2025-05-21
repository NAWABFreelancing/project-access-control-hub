
import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the step is active or not.
   */
  active?: boolean
  /**
   * Whether the step has been completed.
   */
  completed?: boolean
  /**
   * Whether there is an error in the step.
   */
  error?: boolean
  /**
   * Whether to hide the step number when completed.
   */
  hideStepNumber?: boolean
  /**
   * Index of the step
   */
  index: number
  /**
   * Label of the step
   */
  label?: string
  /**
   * Optional description of the step
   */
  description?: string
}

export const Step = React.forwardRef<HTMLDivElement, StepProps>(
  (
    {
      active,
      children,
      className,
      completed,
      description,
      error,
      hideStepNumber,
      index,
      label,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-[20px] flex-1 flex-col gap-1",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full border border-input text-xs",
              active && "border-primary bg-primary text-primary-foreground",
              completed &&
                "border-primary bg-primary text-primary-foreground",
              error && "border-destructive bg-destructive text-destructive-foreground"
            )}
          >
            {completed ? (
              hideStepNumber ? null : (
                <Check className="h-3 w-3" />
              )
            ) : (
              index + 1
            )}
          </div>
          <div className="flex flex-col">
            <div
              className={cn(
                "text-sm font-medium leading-none",
                active && "text-foreground",
                !active && "text-foreground/70",
                error && "text-destructive"
              )}
            >
              {label}
            </div>
            {description && (
              <div
                className={cn(
                  "text-xs text-muted-foreground",
                  error && "text-destructive"
                )}
              >
                {description}
              </div>
            )}
          </div>
        </div>
        {children && (
          <div className="ml-7">
            {children}
          </div>
        )}
      </div>
    )
  }
)
Step.displayName = "Step"

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Sets the active Step
   */
  activeStep?: number
}

export const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  ({ className, activeStep = 0, ...props }, ref) => {
    const validChildren = React.Children.toArray(props.children).filter((child) =>
      React.isValidElement(child)
    ) as React.ReactElement[]

    const steps = validChildren.map((child, index) => {
      return React.cloneElement(child, {
        active: activeStep === index,
        completed: index < activeStep,
        index,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ...child.props,
      })
    })

    return (
      <div ref={ref} className={cn("flex gap-2", className)} {...props}>
        {steps}
      </div>
    )
  }
)
Steps.displayName = "Steps"
