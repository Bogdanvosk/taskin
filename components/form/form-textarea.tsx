'use client'

import type { KeyboardEventHandler } from 'react'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

import { FormErrors } from './form-errors'

interface FormTextareaProps {
  id: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  isLoading?: boolean
  errors?: Record<string, string[]> | undefined
  className?: string
  onBlur?: () => void
  onClick?: () => void
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined
  defaultValue?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      id,
      label,
      placeholder,
      required,
      disabled,
      errors,
      className,
      onBlur,
      onClick,
      onKeyDown,
      defaultValue
    },
    ref
  ) => {
    return (
      <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
          {label ? (
            <Label
              htmlFor={id}
              className="text-sm font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          {/* TODO: add disabled state logic */}
          <Textarea
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            onClick={onClick}
            id={id}
            name={id}
            placeholder={placeholder}
            defaultValue={defaultValue}
            ref={ref}
            disabled={disabled}
            required={required}
            className={cn(
              'resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm',
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

FormTextarea.displayName = 'FormTextarea'
