import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  error?: boolean;
  fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2',
  lg: 'px-4 py-3 text-lg',
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
  inputSize = 'md',
  error = false,
  fullWidth = true,
  disabled,
  className,
  ...props
}, ref) => {
  const baseStyle = 'border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors';
  const normalStyle = 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
  const errorStyle = 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20';
  const disabledStyle = 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800';

  const combinedClassName = clsx(
    baseStyle,
    error ? errorStyle : normalStyle,
    sizeStyles[inputSize],
    disabled && disabledStyle,
    fullWidth && 'w-full',
    'focus:outline-none',
    className
  );

  return (
    <input
      ref={ref}
      className={combinedClassName}
      disabled={disabled}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
