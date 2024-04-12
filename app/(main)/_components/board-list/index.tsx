'use client'

import { useState } from 'react'
import type { Board } from '@prisma/client'
import { animated, useSpring } from '@react-spring/web'
import { useQuery } from '@tanstack/react-query'
import { Heart, User2 } from 'lucide-react'
import Image from 'next/image'

import { FormPopover } from '@/components/form/form-popover'
import { Button } from '@/components/ui/button'
import { favouriteImage } from '@/constants/images'
import { fetcher } from '@/lib/fetcher'
import { cn } from '@/lib/utils'

import { BoardItem } from '../../board/[boardId]/_components/board/board-item'

import { Error } from './error'
import { SkeletonBoardList } from './skeleton'

export const BoardList = () => {
  const [isShowingFavourites, setIsShowingFavourites] = useState(false)

  const {
    data: boards,
    isError: isBoardsError,
    isLoading: isBoardsLoading
  } = useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: () => fetcher(`/api/boards`)
  })

  const {
    data: favourites,
    refetch,
    isError: isFavouritesError
  } = useQuery<Board[]>({
    queryKey: ['favourites'],
    queryFn: () => fetcher(`/api/favourites`),
    enabled: false
  })

  const onFilterFavourites = () => {
    refetch()
    setIsShowingFavourites(!isShowingFavourites)
  }

  const animate = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between font-semibold text-neutral-700">
        <div className="flex items-center">
          <User2 className="h-6 w-6 mr-2 dark:stroke-white" />
          <div className="relative text-[16px] xs:text-lg dark:text-white">
            Your boards
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={onFilterFavourites}
          className={cn(
            'flex gap-2 px-2',
            isShowingFavourites ? 'bg-slate-200 dark:bg-slate-800/70' : ''
          )}
        >
          <div
            className={cn(
              'relative text-[16px] xs:text-lg text-black transition dark:text-white'
            )}
          >
            Favourite boards
            <span
              className={cn(
                'absolute w-full opacity-0 h-[2px] bg-black dark:bg-white left-0 bottom-0 transition',
                isShowingFavourites && 'opacity-100'
              )}
            />
          </div>
          <Heart
            className={cn(
              'fill-transparent stroke-red-400 transition cursor-pointer',
              isShowingFavourites ? 'fill-red-500 stroke-red-500' : ''
            )}
          />
        </Button>
      </div>
      {isBoardsError || isFavouritesError ? <Error /> : null}

      {isBoardsLoading ? <SkeletonBoardList /> : null}

      {boards && (
        <animated.div
          style={animate}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {favourites && isShowingFavourites
            ? favourites.map((board: Board) => (
                <BoardItem key={board.id} data={board} />
              ))
            : boards.map((board: Board) => (
                <BoardItem key={board.id} data={board} />
              ))}
          <FormPopover side="right" sideOffset={10}>
            <div
              role="button"
              className="hidden sm:flex aspect-video relative h-full w-full bg-muted rounded-sm flex-col gap-y-1 items-center justify-center hover:bg-muted/75 transition shadow-sm dark:bg-slate-800 dark:hover:bg-slate-800/75"
            >
              <p className="font-semibold dark:text-white">
                Create a new board
              </p>
            </div>
          </FormPopover>
        </animated.div>
      )}
      <Image
        className={cn(
          'hidden xs:block absolute right-[5px] bottom-[5px] transition duration-500 -z-[1]',
          isShowingFavourites ? 'translate-x-0' : 'translate-x-[110%]'
        )}
        src={favouriteImage}
        alt="Favourite"
        width={200}
        height={200}
      />
    </div>
  )
}
