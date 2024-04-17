import { Heart } from 'lucide-react'

import { cn } from '@/lib/utils'

interface FavouriteButtonProps {
  isFavourite: boolean
  onChangeFavourite?: () => void
}

export const FavouriteButton = ({
  isFavourite,
  onChangeFavourite
}: FavouriteButtonProps) => {
  return (
    <div
      role="button"
      className="cursor-pointer group"
      onClick={onChangeFavourite}
    >
      <Heart
        className={cn(
          'fill-transparent stroke-red-400 transition w-7 h-7 md:w-6 md:h-6',
          isFavourite
            ? 'fill-red-500 stroke-red-500 group-hover:fill-transparent group-hover:stroke-red-400'
            : 'group-hover:fill-red-500 group-hover:stroke-red-500'
        )}
      />
    </div>
  )
}
