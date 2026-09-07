import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withLink?: boolean;
}

export function BrandLogo({ size = 'md', className, withLink = true }: BrandLogoProps) {
  const sizes = {
    sm: { icon: 'h-4 w-4', text: 'text-lg', container: 'gap-1.5' },
    md: { icon: 'h-6 w-6', text: 'text-2xl', container: 'gap-2' },
    lg: { icon: 'h-8 w-8', text: 'text-3xl', container: 'gap-2.5' },
    xl: { icon: 'h-10 w-10', text: 'text-5xl', container: 'gap-3' },
  };

  const currentSize = sizes[size];

  const content = (
    <div className={cn("flex items-center", currentSize.container, className)}>
      <div className="bg-primary-100 p-1.5 rounded-lg text-primary-600 flex items-center justify-center">
        <Leaf className={cn("text-primary-600", currentSize.icon)} />
      </div>
      <span className={cn("font-heading font-bold tracking-tight text-navy-900", currentSize.text)}>
        ILERTI <span className="text-primary-600">Health</span>
      </span>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
