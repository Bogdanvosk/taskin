'use client'

import type { Board } from '@prisma/client'
import Link from 'next/link'

interface BoardItemProps {
  data: Board
  index: number
}

export const BoardItem = ({ data }: BoardItemProps) => {
  return (
    <Link
      href={`/board/${data.id}`}
      style={{
        backgroundImage: `url(${data.imageThumbUrl})`
      }}
      className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition" />
      <p className="relative font-semibold text-white">{data.title}</p>
    </Link>
  )
}
