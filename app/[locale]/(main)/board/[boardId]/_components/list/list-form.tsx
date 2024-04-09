'use client'

import type { ElementRef } from 'react'
import { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Plus, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'

import { createList } from '@/actions/create-list'
import { FormInput } from '@/components/form/form-input'
import { FormSubmit } from '@/components/form/form-submit'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'

import { ListWrapper } from './list-wrapper'

export const ListForm = () => {
  const intl = useIntl()
  const [isEditing, setIsEditing] = useState(false)

  const formRef = useRef<ElementRef<'form'>>(null)
  const inputRef = useRef<ElementRef<'input'>>(null)

  const router = useRouter()

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: () => {
      toast.success('List created')
      disableEditing()
      router.refresh()
    },
    onError: () => {
      toast.error('Failed to create list')
    }
  })
  const params = useParams()

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing()
    }
  }

  useEventListener('keydown', onKeyDown)
  useOnClickOutside(formRef, disableEditing)

  const onCreateList = (formData: FormData) => {
    const title = formData.get('title') as string
    const boardId = params.boardId as string

    execute({
      title,
      boardId
    })
  }

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          action={onCreateList}
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <FormInput
            errors={fieldErrors}
            autocomplete="off"
            ref={inputRef}
            id="title"
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder={intl.formatMessage({ id: 'lists_enter_list_title' })}
          />
          <div className="flex items-center justify-between gap-x-1">
            <FormSubmit>
              {intl.formatMessage({ id: 'lists_add_list' })}
            </FormSubmit>
            <Button onClick={disableEditing} size={'sm'} variant={'ghost'}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    )
  }

  return (
    <ListWrapper>
      {/* TODO: replace fixed width */}
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        {intl.formatMessage({ id: 'lists_add_list' })}
      </button>
    </ListWrapper>
  )
}