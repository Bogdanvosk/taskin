import type { Board } from '@prisma/client'

import { BoardOptions } from './board-options'
import { BoardTitleForm } from './board-title-form'

interface BoardNavbarProps {
  data: Board
}

export const BoardNavbar = ({ data }: BoardNavbarProps) => {
  return (
    <div className="w-full h-14 z-[40] bg-transparent/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm data={data} />
      <div className="ml-auto">
        <BoardOptions id={data.id} />
      </div>
    </div>
  )
}
