import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C97384] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[#C86D7E] via-[#B85D6F] to-[#A64E60] text-white font-semibold hover:brightness-105 shadow-[0_6px_20px_rgba(184,93,111,0.24)]',
        destructive:
          'bg-[#BE123C] text-white hover:bg-[#9F1239]',
        outline:
          'border border-[#E4D3CD] bg-white text-[#281E1C] hover:bg-[#FBF2F3] hover:border-[#C86D7E]',
        secondary:
          'bg-[#F5EBE8] text-[#281E1C] hover:bg-[#EDE0DC] border border-[#E4D3CD]',
        ghost:
          'text-[#6E5A56] hover:bg-[#F5EBE8] hover:text-[#281E1C]',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-4 text-[11px]',
        lg: 'h-12 px-7 text-xs',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
