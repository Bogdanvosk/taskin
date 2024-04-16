'use client'

import type { Board } from '@prisma/client'
import { Heart } from 'lucide-react'
import Link from 'next/link'

interface BoardItemProps {
  data: Board
}

export const BoardItem = ({ data }: BoardItemProps) => {
  // console.log('data', data)
  return (
    <Link
      href={`/board/${data.id}`}
      style={{
        backgroundImage: `url(${data.imageThumbUrl})`
      }}
      className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-[#6C63FF] dark:bg-slate-500 rounded-sm h-full w-full p-2 overflow-hidden"
    >
      {data.isFavourite && (
        <Heart className="absolute right-2 top-2 z-10 fill-red-500 stroke-red-500" />
      )}
      <div className="z-5 absolute inset-0 bg-black/50 group-hover:bg-black/40 transition" />
      <p className="relative font-semibold text-white text-sm xs:text-[16px]">
        {data.title}
      </p>
    </Link>
  )
}
