'use client'

import { changeFavourite } from '@/actions/change-favourite'

import { FavouriteButton } from '../favourite-button'

import { BoardOptions } from './board-options'
import { BoardTitleForm } from './board-title-form'
import { useAction } from '@/hooks/use-action'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'

interface BoardNavbarProps {
  data: any
}

export const BoardNavbar = ({ data }: BoardNavbarProps) => {
  const { boardId } = useParams()

  const { execute } = useAction(changeFavourite, {
    onSuccess: () => {
      toast.success(`Board updated`)
    }
  })
  const onChangeFavourite = () => {
    execute({ id: boardId as string, isFavourite: data.isFavourite })
  }

  return (
    <div className="w-full h-14 z-[40] bg-transparent/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm data={data} />
      <div className="ml-auto flex gap-3 md:gap-1 items-center">
        <FavouriteButton
          isFavourite={data.isFavourite}
          onChangeFavourite={onChangeFavourite}
        />
        <BoardOptions />
      </div>
    </div>
  )
}
