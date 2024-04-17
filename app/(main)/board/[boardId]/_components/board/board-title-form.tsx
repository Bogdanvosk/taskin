'use client'

import type { ElementRef } from 'react'
import { useRef, useState } from 'react'

import { toast } from 'sonner'
import { updateBoard } from '@/actions/update-board'
import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import type { Board } from '@/types'
import { useParams } from 'next/navigation'

interface BoardTitleFormProps {
  data: Board
}

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
  const { boardId } = useParams()

  const [title, setTitle] = useState(data.title)
  const [isEditing, setIsEditing] = useState(false)

  const formRef = useRef<ElementRef<'form'>>(null)
  const inputRef = useRef<ElementRef<'input'>>(null)

  const disableEditing = () => {
    setIsEditing(false)
  }

  const { execute } = useAction(updateBoard, {
    onSuccess: () => {
      toast.success(`Board updated`)
      disableEditing()
    },
    onError: () => {
      toast.error('Failed to update board')
    }
  })

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }

  const renameBoardTitle = (formData: FormData) => {
    const newTitle = formData.get('title') as string
    if (title === newTitle) {
      disableEditing()
      return
    }
    execute({ id: boardId as string, title: newTitle }).then(() => {
      setTitle(newTitle)
    })
  }

  const onInputBlur = () => {
    formRef.current?.requestSubmit()
  }

  if (isEditing) {
    return (
      <form
        action={renameBoardTitle}
        ref={formRef}
        className="flex items-center gap-x-2"
      >
        <FormInput
          ref={inputRef}
          id="title"
          onBlur={onInputBlur}
          defaultValue={title}
          className="text-lg font-medium px-[7px] py-1 h-7 bg-transparent border-none"
        />
      </form>
    )
  }
  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-medium text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  )
}
