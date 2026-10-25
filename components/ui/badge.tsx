import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center whitespace-nowrap shrink-0 rounded-full px-2.5 py-0.5 text-[10px] tracking-widest uppercase font-semibold transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'border border-[#E4D3CD] bg-[#F7EFEA] text-[#5C4A47]',
        pass:
          'border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]',
        violation:
          'border border-[#FECDD3] bg-[#FFF1F2] text-[#9F1239]',
        warning:
          'border border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]',
        outline:
          'border border-[#D8B4A6] text-[#8E5B65] bg-white',
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
