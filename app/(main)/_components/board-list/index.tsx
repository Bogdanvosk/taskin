'use client'

import type { Board } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { User2 } from 'lucide-react'

import { FormPopover } from '@/components/form/form-popover'
import { fetcher } from '@/lib/fetcher'

import { BoardItem } from '../../board/[boardId]/_components/board-item'

import { SkeletonBoardList } from './skeleton'

export const BoardList = () => {
  const { data } = useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: () => fetcher(`/api/boards`)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your boards
      </div>
      {data ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((board: Board, index: number) => (
            <BoardItem key={board.id} index={index} data={board} />
          ))}
          <FormPopover side="right" sideOffset={10}>
            <div
              role="button"
              className="hidden sm:flex aspect-video relative h-full w-full bg-muted rounded-sm flex-col gap-y-1 items-center justify-center hover:opacity-75 transition shadow-sm"
            >
              <p className="font-semibold">Create a new board</p>
            </div>
          </FormPopover>
        </div>
      ) : (
        <SkeletonBoardList />
      )}
    </div>
  )
}
