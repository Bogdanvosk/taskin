'use client'

import { forwardRef } from 'react'
import { useFormStatus } from 'react-dom'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { FormErrors } from './form-errors'

interface FormInputProps {
  id: string
  label?: string
  type?: string
  placeholder?: string
  autocomplete?: 'on' | 'off'
  required?: boolean
  disabled?: boolean
  errors?: Record<string, string[] | undefined>
  className?: string
  defaultValue?: string
  onBlur?: () => void
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      autocomplete,
      label,
      type,
      placeholder,
      required,
      disabled,
      errors,
      className,
      defaultValue = '',
      onBlur
    },
    ref
  ) => {
    const { pending } = useFormStatus()

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700 dark:text-white"
            >
              {label}
            </Label>
          ) : null}
          <Input
            autoComplete={autocomplete}
            name={id}
            onBlur={onBlur}
            defaultValue={defaultValue}
            ref={ref}
            required={required}
            id={id}
            type={type}
            placeholder={placeholder}
            disabled={pending || disabled}
            className={cn(
              'text-sm px-2 py-1 h-7 dark:bg-slate-700 dark:focus-visible:border-transparent dark:text-white dark:border-transparent',
              className
            )}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    )
  }
)
