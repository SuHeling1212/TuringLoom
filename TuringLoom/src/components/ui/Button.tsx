import { ReactNode, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow',
  secondary: 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow',
  ghost: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
  outline: 'border border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-sm rounded-md',
  md: 'px-4 py-2 rounded-md',
  lg: 'px-6 py-3 text-lg rounded-md',
  icon: 'p-2 rounded-md',
};

const disabledStyle = 'cursor-not-allowed opacity-50';

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyle = 'font-medium transition-all flex items-center justify-center gap-2';
  
  const combinedClassName = clsx(
    baseStyle,
    variantStyles[variant],
    sizeStyles[size],
    disabled && disabledStyle,
    fullWidth && 'w-full',
    className
  );

  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
}
