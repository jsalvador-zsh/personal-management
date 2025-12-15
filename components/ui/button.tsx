import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand-400 dark:bg-brand-500 text-white border border-brand-500/75 hover:bg-brand-500 dark:hover:bg-brand-600 shadow-sm",
        destructive:
          "bg-error text-white hover:bg-error-dark border border-error-dark/20 shadow-sm",
        outline:
          "border border-muted-foreground/20 bg-transparent hover:bg-muted/50 text-foreground",
        secondary:
          "bg-muted text-foreground hover:bg-muted-foreground/10 border border-muted-foreground/20 shadow-sm",
        ghost: "hover:bg-muted/50 text-foreground",
        link: "text-brand-500 underline-offset-4 hover:underline",
        success: "bg-success text-white hover:bg-success-dark border border-success-dark/20 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
