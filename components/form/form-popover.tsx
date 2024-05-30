'use client'

import type { ElementRef } from 'react'
import { useRef } from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { createBoard } from '@/actions/create-board'
import { useAction } from '@/hooks/use-action'

import { Button } from '../ui/button'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from '../ui/popover'

import { FormInput } from './form-input'
import { FormPicker } from './form-picker'
import { FormSubmit } from './form-submit'

interface FormPopoverProps {
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

export const FormPopover = ({
  children,
  align,
  side = 'bottom',
  sideOffset = 0
}: FormPopoverProps) => {
  const router = useRouter()
  const closeButtonRef = useRef<ElementRef<'button'>>(null)

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success('New board created!')
      closeButtonRef.current?.click()
      router.push(`/board/${data.id}`)
    },
    onError: (error) => {
      console.error({ error })
      toast.error(error)
    }
  })

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string
    const image = formData.get('image') as string

    execute({ title, image })
  }
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 pt-3 dark:bg-slate-800"
        align={align}
        side={side}
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4 dark:text-white">
          Создать доску
        </div>
        <PopoverClose ref={closeButtonRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            <FormInput
              id="title"
              label="Имя доски"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full dark:text-white">Создать</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  )
}
