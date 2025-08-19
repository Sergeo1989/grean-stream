import React, { forwardRef, ReactNode } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '@/lib/utils';
import { ValidationError } from '@/lib/validation';
import { ValidationRule } from '@/types/enums';

export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'textarea' 
  | 'select'
  | 'hidden';

export interface FormFieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormFieldProps {
  // Core props
  id?: string;
  name?: string;
  type?: FormFieldType;
  label?: string;
  value?: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  className?: string;
  
  // Select specific
  options?: FormFieldOption[];
  selectPlaceholder?: string;
  
  // Textarea specific
  rows?: number;
  
  // Validation
  errors?: ValidationError[];
  showErrors?: boolean;
  
  // Styling
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  
  // Events
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  
  // Additional content
  prefix?: ReactNode;
  suffix?: ReactNode;
  helperText?: string;
  
  // Layout
  orientation?: 'vertical' | 'horizontal';
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, FormFieldProps>(
  ({
    id,
    name,
    type = 'text',
    label,
    value,
    placeholder,
    required = false,
    disabled = false,
    readonly = false,
    className,
    options = [],
    selectPlaceholder = 'Sélectionner...',
    rows = 3,
    errors = [],
    showErrors = true,
    variant = 'default',
    size = 'md',
    onChange,
    onBlur,
    onFocus,
    prefix,
    suffix,
    helperText,
    orientation = 'vertical',
    labelClassName,
    inputClassName,
    errorClassName,
    ...props
  }, ref) => {
    
    const fieldErrors = name ? errors.filter(error => error.field === name) : [];
    const hasErrors = fieldErrors.length > 0;
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
      onChange?.(newValue);
    };
    
    const handleSelectChange = (newValue: string) => {
      const finalValue = type === 'number' ? parseFloat(newValue) || 0 : newValue;
      onChange?.(finalValue);
    };
    
    const sizeClasses = {
      sm: 'h-8 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base'
    };
    
    const containerClasses = cn(
      'space-y-2',
      orientation === 'horizontal' && 'flex items-center space-y-0 space-x-4',
      className
    );
    
    const inputClasses = cn(
      sizeClasses[size],
      hasErrors && 'border-destructive focus-visible:ring-destructive/20',
      inputClassName
    );
    
    const renderLabel = () => {
      if (!label) return null;
      
      return (
        <Label 
          htmlFor={id}
          className={cn(
            'text-sm font-medium text-foreground',
            required && "after:content-['*'] after:ml-0.5 after:text-destructive",
            disabled && 'opacity-50',
            labelClassName
          )}
        >
          {label}
        </Label>
      );
    };
    
    const renderInput = () => {
      if (type === 'hidden') {
        return (
          <input
            type="hidden"
            id={id}
            name={name}
            value={value}
            onChange={handleInputChange}
          />
        );
      }
      
      if (type === 'textarea') {
        return (
          <div className="relative">
            {prefix && (
              <div className="absolute left-3 top-3 text-muted-foreground">
                {prefix}
              </div>
            )}
            <Textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={id}
              name={name}
              value={value}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              readOnly={readonly}
              rows={rows}
              className={cn(
                inputClasses,
                prefix && 'pl-10',
                suffix && 'pr-10',
                'min-h-[80px] resize-y'
              )}
              onChange={handleInputChange}
              onBlur={onBlur}
              onFocus={onFocus}
              {...props}
            />
            {suffix && (
              <div className="absolute right-3 top-3 text-muted-foreground">
                {suffix}
              </div>
            )}
          </div>
        );
      }
      
      if (type === 'select') {
        return (
          <Select
            value={value?.toString()}
            onValueChange={handleSelectChange}
            disabled={disabled}
            required={required}
          >
            <SelectTrigger 
              className={cn(inputClasses)}
              id={id}
              name={name}
              onBlur={onBlur}
              onFocus={onFocus}
            >
              <SelectValue placeholder={selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value.toString()}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      
      // Default input types
      return (
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {prefix}
            </div>
          )}
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readonly}
            className={cn(
              inputClasses,
              prefix && 'pl-10',
              suffix && 'pr-10'
            )}
            onChange={handleInputChange}
            onBlur={onBlur}
            onFocus={onFocus}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {suffix}
            </div>
          )}
        </div>
      );
    };
    
    const renderErrors = () => {
      if (!showErrors || !hasErrors) return null;
      
      return (
        <div className={cn('space-y-1', errorClassName)}>
          {fieldErrors.map((error, index) => (
            <p 
              key={index}
              className="text-xs text-destructive flex items-center gap-1"
              role="alert"
            >
              <span className="inline-block w-1 h-1 bg-destructive rounded-full" />
              {error.message}
            </p>
          ))}
        </div>
      );
    };
    
    const renderHelperText = () => {
      if (!helperText) return null;
      
      return (
        <p className="text-xs text-muted-foreground">
          {helperText}
        </p>
      );
    };
    
    if (type === 'hidden') {
      return renderInput();
    }
    
    return (
      <div className={containerClasses}>
        {renderLabel()}
        <div className="space-y-2">
          {renderInput()}
          {renderErrors()}
          {renderHelperText()}
        </div>
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
export default FormField;

// Utility functions for common field configurations
export const FormFieldPresets = {
  // Email field with validation
  Email: (props: Partial<FormFieldProps>) => (
    <FormField
      type="email"
      placeholder="exemple@email.com"
      {...props}
    />
  ),
  
  // Password field
  Password: (props: Partial<FormFieldProps>) => (
    <FormField
      type="password"
      placeholder="••••••••"
      {...props}
    />
  ),
  
  // Phone number field
  Phone: (props: Partial<FormFieldProps>) => (
    <FormField
      type="tel"
      placeholder="+237 6XX XXX XXX"
      prefix={<span className="text-xs">📞</span>}
      {...props}
    />
  ),
  
  // Currency amount field
  Amount: (props: Partial<FormFieldProps>) => (
    <FormField
      type="number"
      placeholder="0"
      suffix={<span className="text-xs font-medium">XAF</span>}
      {...props}
    />
  ),
  
  // Required text field
  Required: (props: Partial<FormFieldProps>) => (
    <FormField
      required
      {...props}
    />
  )
};

// Hook for form field state management
export const useFormField = (initialValue: string | number = '') => {
  const [value, setValue] = React.useState(initialValue);
  const [errors, setErrors] = React.useState<ValidationError[]>([]);
  const [touched, setTouched] = React.useState(false);
  
  const handleChange = (newValue: string | number) => {
    setValue(newValue);
    if (touched && errors.length > 0) {
      // Clear errors when user starts typing
      setErrors([]);
    }
  };
  
  const handleBlur = () => {
    setTouched(true);
  };
  
  const validate = (_validationRules: ValidationRule[]) => {
    // This would integrate with the validation system
    // For now, return empty errors
    return [];
  };
  
  return {
    value,
    errors,
    touched,
    onChange: handleChange,
    onBlur: handleBlur,
    setErrors,
    validate
  };
};