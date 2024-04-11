'use client'

import type { ElementRef, KeyboardEventHandler } from 'react'
import { forwardRef, useRef } from 'react'
import { Plus, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'

import { createCard } from '@/actions/create-card'
import { FormSubmit } from '@/components/form/form-submit'
import { FormTextarea } from '@/components/form/form-textarea'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import { FormInput } from '@/components/form/form-input'

interface CardFormProps {
  listId: string
  isEditing: boolean
  disableEditing: () => void
  enableEditing: () => void
}

export const CardForm = forwardRef<HTMLInputElement, CardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const params = useParams()

    const formRef = useRef<ElementRef<'form'>>(null)

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" created`)
        formRef.current?.reset()
        disableEditing()
      },
      onError: (error) => {
        toast.error(error)
      }
    })

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

    useOnClickOutside(formRef, disableEditing)
    useEventListener('keydown', onKeyDown)

    const onCreateCard = (formData: FormData) => {
      const title = formData.get('title') as string
      const description = formData.get('description') as string
      const listId = formData.get('listId') as string
      const boardId = params.boardId as string

      execute({
        title,
        listId,
        description,
        boardId
      })
    }

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onCreateCard}
          className="m-1 py-0.5 space-y-4"
        >
          <div className="space-y-2 border-2 border-border-primary p-1 rounded-md shadow-md">
            <FormInput
              id="title"
              ref={ref}
              placeholder="Enter card title"
              errors={fieldErrors}
            />
            <FormTextarea
              id="description"
              onKeyDown={onTextareaKeydown}
              placeholder="Enter card description"
              errors={fieldErrors}
            />
            <input readOnly hidden id="listId" value={listId} name="listId" />
          </div>
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add card</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      )
    }

    return (
      <div className="pt-2 px-2">
        <Button
          variant="ghost"
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </div>
    )
  }
)

CardForm.displayName = 'CardForm'
