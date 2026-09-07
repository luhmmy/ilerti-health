import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withLink?: boolean;
}

export function BrandLogo({ size = 'md', className, withLink = true }: BrandLogoProps) {
  const heights = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
    xl: 'h-14',
  };

  const content = (
    <div className={cn("flex items-center", className)}>
      <img
        src="/logo.jpg"
        alt="ILERTI Health"
        className={cn("w-auto object-contain mix-blend-multiply", heights[size])}
      />
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

