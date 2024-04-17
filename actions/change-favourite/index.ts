'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
// import { db } from '@/lib/db'

import { changeFavouriteSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id, isFavourite } = data

  let board
  // try {
  //   board = await db.board.update({
  //     where: {
  //       id,
  //       userId
  //     },
  //     data: {
  //       isFavourite: !isFavourite
  //     }
  //   })
  // } catch (error) {
  //   return {
  //     error: 'Failed to update board'
  //   }
  // }

  revalidatePath(`/board/${id}`)

  return {
    data: board
  }
}

export const changeFavourite = createSafeAction(changeFavouriteSchema, handler)
