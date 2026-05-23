import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';

type SelectSize = 'sm' | 'md' | 'lg';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options?: SelectOption[];
  selectSize?: SelectSize;
  error?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

const sizeStyles: Record<SelectSize, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2',
  lg: 'px-4 py-3 text-lg',
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  selectSize = 'md',
  error = false,
  fullWidth = true,
  disabled,
  className,
  children,
  ...props
}, ref) => {
  const baseStyle = 'border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors appearance-none cursor-pointer';
  const normalStyle = 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
  const errorStyle = 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20';
  const disabledStyle = 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800';

  const combinedClassName = clsx(
    baseStyle,
    error ? errorStyle : normalStyle,
    sizeStyles[selectSize],
    disabled && disabledStyle,
    fullWidth && 'w-full',
    'focus:outline-none',
    'pr-8',
    className
  );

  return (
    <div className={clsx('relative', fullWidth && 'w-full')}>
      <select
        ref={ref}
        className={combinedClassName}
        disabled={disabled}
        {...props}
      >
        {children || (options?.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        )))}
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <i className="fa-solid fa-chevron-down text-xs"></i>
      </span>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
