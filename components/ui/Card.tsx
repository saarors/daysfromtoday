import { cn } from '@/lib/cn';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient';
  className?: string;
}

/**
 * 卡片组件（参考 Calendly 设计）
 */
export function Card({ children, variant = 'default', className }: CardProps) {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white border-0 shadow-lg',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 border-0',
  };
  
  return (
    <div className={cn(
      'rounded-2xl p-6 transition-all duration-200',
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-2xl font-bold text-gray-900', className)}>
      {children}
    </h3>
  );
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-gray-600', className)}>
      {children}
    </p>
  );
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-6 flex items-center gap-3', className)}>
      {children}
    </div>
  );
}

