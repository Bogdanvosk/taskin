'use client'

// import { toast } from 'sonner'

// import { changeFavourite } from '@/actions/change-favourite'
// import { useAction } from '@/hooks/use-action'

import { FavouriteButton } from '../favourite-button'

import { BoardOptions } from './board-options'
import { BoardTitleForm } from './board-title-form'

interface BoardNavbarProps {
  data: any
}

export const BoardNavbar = ({ data }: BoardNavbarProps) => {
  // const { execute } = useAction(changeFavourite, {
  //   onSuccess: (data) => {
  //     toast.success(
  //       `Board "${data.title}" ${data.isFavourite ? 'added in favourites' : 'updated'}`
  //     )
  //   }
  // })
  // const onChangeFavourite = () => {
  //   execute({ id: data.id, isFavourite: data.isFavourite })
  // }

  return (
    <div className="w-full h-14 z-[40] bg-transparent/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm data={data} />
      <div className="ml-auto flex gap-3 md:gap-1 items-center">
        <FavouriteButton
          isFavourite={data.isFavourite}
          // onChangeFavourite={onChangeFavourite}
        />
        <BoardOptions id={data.id} />
      </div>
    </div>
  )
}
