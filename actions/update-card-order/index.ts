'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
// import { db } from '@/lib/db'

import { updateCardOrderSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { items, boardId } = data

  let updatedCards
  // try {
  //   const transaction = items.map((card) => {
  //     return db.card.update({
  //       where: {
  //         id: card.id,
  //         list: {
  //           board: {
  //             userId
  //           }
  //         }
  //       },
  //       data: {
  //         order: card.order,
  //         listId: card.listId
  //       }
  //     })
  //   })

  //   updatedCards = await db.$transaction(transaction)
  // } catch (err) {
  //   return {
  //     error: 'Failed to reorder updatedCards'
  //   }
  // }

  revalidatePath(`/board/${boardId}`)

  return {
    data: updatedCards
  }
}

export const updateCardOrder = createSafeAction(updateCardOrderSchema, handler)
