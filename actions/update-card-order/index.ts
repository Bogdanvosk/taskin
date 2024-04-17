'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'

// import { db } from '@/lib/db'
import { updateCardOrderSchema } from './schema'
import type { InputType, ReturnType } from './types'
import { doc, writeBatch } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { items, boardId } = data

  const batch = writeBatch(db)

  let updatedCards
  try {
    for (const card of items) {
      batch.update(doc(db, 'cards', card.id), {
        order: card.order + 1
      })
    }

    await batch.commit()
  } catch (error) {
    return {
      error: 'Failed to reorder lists'
    }
  }
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
