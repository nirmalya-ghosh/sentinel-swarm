import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border text-sm font-semibold uppercase tracking-[0.08em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-teal-400 bg-teal-400 text-zinc-950 hover:bg-teal-300",
        secondary: "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800",
        ghost: "border-transparent text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white",
        danger: "border-rose-500 bg-rose-600 text-white hover:bg-rose-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
