'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'

import { updateListOrderSchema } from './schema'
import type { InputType, ReturnType } from './types'
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
  writeBatch
} from 'firebase/firestore'
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

  try {
    for (const list of items) {
      batch.update(doc(db, 'lists', list.id), {
        order: list.order + 1
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
    data: boardId
  }
}

export const updateListOrder = createSafeAction(updateListOrderSchema, handler)
