'use server'

import { auth } from '@clerk/nextjs'
import { doc, writeBatch } from 'firebase/firestore'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/firebaseConfig'

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

  const batch = writeBatch(db)

  let updatedCards
  try {
    for (const card of items) {
      batch.update(doc(db, 'cards', card.id), {
        order: card.order,
        listId: card.listId
      })
    }

    await batch.commit()
  } catch (error) {
    return {
      error: 'Failed to reorder lists'
    }
  }

  revalidatePath(`/board/${boardId}`)

  return {
    data: updatedCards
  }
}

export const updateCardOrder = createSafeAction(updateCardOrderSchema, handler)
