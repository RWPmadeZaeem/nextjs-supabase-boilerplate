'use client';

import { Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SnippyLogoProps = {
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBackground?: boolean;
};

const sizeMap = {
  sm: { container: 'h-10 w-10', icon: 'h-5 w-5' },
  md: { container: 'h-12 w-12', icon: 'h-6 w-6' },
  lg: { container: 'h-14 w-14', icon: 'h-8 w-8' },
  xl: { container: 'h-16 w-16', icon: 'h-10 w-10' },
};

export const SnippyLogo = ({
  className,
  iconClassName,
  size = 'lg',
  showBackground = true,
}: SnippyLogoProps) => {
  const sizes = sizeMap[size];

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl',
        showBackground &&
          'bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30',
        sizes.container,
        className,
      )}
    >
      <Code2
        className={cn('text-emerald-400', sizes.icon, iconClassName)}
      />
    </div>
  );
};

