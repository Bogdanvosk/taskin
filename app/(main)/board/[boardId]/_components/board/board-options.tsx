'use client'

import { MoreHorizontal, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { copyBoard } from '@/actions/copy-board'
import { deleteBoard } from '@/actions/delete-board'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useAction } from '@/hooks/use-action'

export const BoardOptions = () => {
  const { boardId } = useParams()

  const { execute: executeDeleteBoard, isLoading } = useAction(deleteBoard, {
    onError: () => {
      toast.error('Failed to delete board')
    }
  })

  const { execute: executeCopyBoard } = useAction(copyBoard, {
    onError: () => {
      toast.error('Failed to copy board')
    }
  })

  const onDeleteBoard = () => {
    executeDeleteBoard({ id: boardId as string })
  }

  const onCopyBoard = () => {
    executeCopyBoard({ id: boardId as string })
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="h-auto w-auto p-2 dark:hover:bg-slate-500/40"
            variant="transparent"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="px-0 py-3" side="bottom" align="start">
          <div className="text-sm font-medium text-center text-neutral-600 dark:text-white pb-4">
            Board actions
          </div>
          <PopoverClose asChild>
            <Button
              variant="ghost"
              className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 "
            >
              <X className="h-4 w-4" />
            </Button>
          </PopoverClose>
          <Button
            disabled={isLoading}
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm "
            variant="ghost"
            onClick={onCopyBoard}
          >
            Copy board
          </Button>
          <Button
            disabled={isLoading}
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm "
            variant="ghost"
            onClick={onDeleteBoard}
          >
            Delete this board
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
