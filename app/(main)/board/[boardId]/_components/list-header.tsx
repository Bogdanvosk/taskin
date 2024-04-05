'use client'

import type { ElementRef } from 'react'
import { useRef, useState } from 'react'
import type { List } from '@prisma/client'
import { toast } from 'sonner'
import { useEventListener } from 'usehooks-ts'

import { updateList } from '@/actions/update-list'
import { FormInput } from '@/components/form/form-input'
import { useAction } from '@/hooks/use-action'

import { ListOptions } from './list-options'

interface ListHeaderProps {
  data: List
  onAddCard: () => void
  onChangeIsEditing: (isListHeaderEditing: boolean) => void
}

export const ListHeader = ({
  data,
  onAddCard,
  onChangeIsEditing
}: ListHeaderProps) => {
  const [title, setTitle] = useState(data.title)
  const [isEditing, setIsEditing] = useState(false)

  const formRef = useRef<ElementRef<'form'>>(null)
  const inputRef = useRef<ElementRef<'input'>>(null)

  const enableEditing = () => {
    setIsEditing(true)
    onChangeIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
    onChangeIsEditing(false)
  }

  const { execute, fieldErrors } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" updated`)
      setTitle(data.title)
      disableEditing()
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      formRef.current?.requestSubmit()
    }
  }

  const onUpdateList = (formData: FormData) => {
    const newTitle = formData.get('title') as string

    const { id } = data
    const { boardId } = data

    if (title === newTitle) {
      disableEditing()
      return
    }

    execute({
      id,
      title: newTitle,
      boardId
    })
  }

  const onInputBlur = () => {
    formRef.current?.requestSubmit()
  }

  useEventListener('keydown', onKeyDown)

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form ref={formRef} className="flex-1 px-[2px]" action={onUpdateList}>
          <FormInput
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
            id="title"
            ref={inputRef}
            defaultValue={title}
            onBlur={onInputBlur}
            placeholder="Enter list title"
            errors={fieldErrors}
          />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full flex items-center text-sm px-2.5 py-1 transition h-7 font-medium border-2 border-transparent cursor-pointer hover:border-black/50 rounded-sm"
        >
          {title}
        </div>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  )
}
