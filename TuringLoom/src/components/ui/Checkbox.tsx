import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  disabled,
  className,
  checked,
  onChange,
  ...props
}, ref) => {
  const baseStyle = 'w-4 h-4 rounded border transition-colors appearance-none cursor-pointer';
  const checkedStyle = 'bg-blue-600 border-blue-600';
  const uncheckedStyle = 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600';
  const disabledStyle = 'opacity-50 cursor-not-allowed';
  const focusStyle = 'focus:ring-2 focus:ring-blue-500/20 focus:outline-none';

  const inputClassName = clsx(
    baseStyle,
    checked ? checkedStyle : uncheckedStyle,
    disabled && disabledStyle,
    focusStyle,
    className
  );

  return (
    <label className={clsx(
      'inline-flex items-center gap-2 cursor-pointer',
      disabled && 'cursor-not-allowed'
    )}>
      <span className="relative inline-flex items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          className={inputClassName}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          {...props}
        />
        {checked && (
          <span className="absolute pointer-events-none text-white text-xs">
            <i className="fa-solid fa-check"></i>
          </span>
        )}
      </span>
      {label && (
        <span className={clsx(
          'text-sm font-medium text-slate-700 dark:text-slate-300',
          disabled && 'opacity-50'
        )}>
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
