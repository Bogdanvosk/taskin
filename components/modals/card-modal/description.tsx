'use client'

import type { ElementRef } from 'react'
import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AlignLeft } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'

import { updateCard } from '@/actions/update-card'
import { FormSubmit } from '@/components/form/form-submit'
import { FormTextarea } from '@/components/form/form-textarea'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAction } from '@/hooks/use-action'
import type { CardWithList } from '@/types'

interface DescriptionProps {
  data: CardWithList
}

export const Description = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient()
  const params = useParams()

  const [isEditing, setIsEditing] = useState(false)

  const formRef = useRef<ElementRef<'form'>>(null)
  const textareaRef = useRef<ElementRef<'textarea'>>(null)

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id]
      })
      toast.success(`Card ${data.title} updated`)
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing()
    }
  }

  const onTextareaKeydown = (
    e: React.KeyboardEvent<ElementRef<'textarea'>>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      formRef.current?.requestSubmit()
      disableEditing()
    }
  }

  useEventListener('keydown', onKeyDown)
  useOnClickOutside(formRef, disableEditing)

  const onSubmit = (formData: FormData) => {
    const description = formData.get('description') as string
    const boardId = params.boardId as string

    execute({
      id: data.id,
      boardId,
      description
    })
  }

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700 dark:text-white" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2 dark:text-white">
          Описание
        </p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              onKeyDown={onTextareaKeydown}
              id="description"
              className="w-full "
              placeholder="Введите описание"
              defaultValue={data.description || undefined}
              ref={textareaRef}
              errors={fieldErrors}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Сохранить</FormSubmit>
              <Button
                type="button"
                variant="ghost"
                onClick={disableEditing}
                size="sm"
              >
                Отменить
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 dark:bg-slate-500/80 rounded-md text-sm font-medium py-3 px-3.5 hover:bg-neutral-300 transition"
          >
            {data.description || 'Введите описание...'}
          </div>
        )}
      </div>
    </div>
  )
}

Description.Skeleton = () => {
  return (
    <div className="flex items-center gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
        <Skeleton className="h-[78px] w-full mb-2 bg-neutral-200" />
      </div>
    </div>
  )
}
