'use client'

import type { ElementRef } from 'react'
import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Layout } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { updateCard } from '@/actions/update-card'
import { FormInput } from '@/components/form/form-input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAction } from '@/hooks/use-action'
import type { CardWithList } from '@/types'

interface HeaderProps {
  data: CardWithList
}

export const Header = ({ data: card }: HeaderProps) => {
  const queryClient = useQueryClient()
  const params = useParams()

  const [title, setTitle] = useState(card.title)

  const inputRef = useRef<ElementRef<'input'>>(null)

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['card', card.id]
      })

      toast.success(`Card renamed to "${data.title}"`)
      setTitle(data.title)
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit()
  }

  const onSubmit = (formData: FormData) => {
    const id = card.id
    const title = formData.get('title') as string
    const boardId = params.boardId as string

    if (title === card.title) return

    execute({
      id,
      title,
      boardId
    })
  }

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700 dark:text-white" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 dark:text-white dark:bg-transparent dark:focus-visible:bg-slate-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
        <p className="text-sm text-muted-foreground dark:text-white">
          in list{' '}
          <span className="relative">
            <span className="absolute left-0 -bottom-[2px] h-[1px] w-full bg-muted-foreground dark:bg-white"></span>
            {card.list && card.list.title}
          </span>
        </p>
      </div>
    </div>
  )
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  )
}
