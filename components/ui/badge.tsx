import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center whitespace-nowrap shrink-0 rounded-md px-2 py-0.5 text-xs font-mono font-semibold transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'border border-slate-700 bg-slate-800 text-slate-200',
        pass:
          'border border-emerald-500/60 bg-emerald-950/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
        violation:
          'border border-rose-500/70 bg-rose-950/70 text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.28)]',
        warning:
          'border border-amber-500/60 bg-amber-950/60 text-amber-300',
        outline:
          'border border-slate-700 text-slate-300 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
