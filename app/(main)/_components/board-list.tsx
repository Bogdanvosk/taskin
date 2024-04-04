import { auth } from '@clerk/nextjs'
import type { Board } from '@prisma/client'
import { User2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { FormPopover } from '@/components/form/form-popover'
import { Skeleton } from '@/components/ui/skeleton'
import { db } from '@/lib/db'

export const BoardList = async () => {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const boards = await db.board.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board: Board) => (
          <Link
            href={`/board/${board.id}`}
            key={board.id}
            style={{
              backgroundImage: `url(${board.imageThumbUrl})`
            }}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
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
    </div>
  )
}

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  )
}
