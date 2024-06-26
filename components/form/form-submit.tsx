'use client'

import { useFormStatus } from 'react-dom'

import { Button } from '../ui/button'

interface FormSubmitProps {
  children: React.ReactNode
  disabled?: boolean
  className?: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary'
}

export const FormSubmit = ({
  children,
  disabled,
  className,
  variant = 'primary'
}: FormSubmitProps) => {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending || disabled}
      className={className}
      variant={variant}
    >
      {children}
    </Button>
  )
}
