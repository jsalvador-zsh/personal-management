import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-brand-50 text-brand-700 border-brand-200",
        secondary:
          "bg-muted text-foreground border-muted-foreground/20",
        destructive:
          "bg-error-light/10 text-error-dark border-error/20",
        outline: "text-foreground border-muted-foreground/30 bg-transparent",
        brand:
          "bg-brand-50 text-brand-700 border-brand-200",
        success:
          "bg-success-light/10 text-success-dark border-success/20",
        warning:
          "bg-warning-light/10 text-warning-dark border-warning/20",
        error:
          "bg-error-light/10 text-error-dark border-error/20",
        info:
          "bg-info-light/10 text-info-dark border-info/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
