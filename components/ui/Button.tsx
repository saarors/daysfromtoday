import { cn } from '@/lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

/**
 * 按钮组件
 */
export function Button({ 
  variant = 'default', 
  size = 'md',
  children,
  className,
  ...props 
}: ButtonProps) {
  const variants = {
    default: 'bg-gray-900 text-white hover:bg-gray-800',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-purple-600 text-white hover:bg-purple-700',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    link: 'text-blue-600 hover:text-blue-700 hover:underline',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

