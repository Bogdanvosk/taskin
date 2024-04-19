'use server'

import { auth } from '@clerk/nextjs'
import { doc, updateDoc } from 'firebase/firestore'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/firebaseConfig'

import { updateCardSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { boardId, id, ...values } = data

  try {
    const cardRef = doc(db, 'cards', id)

    await updateDoc(cardRef, {
      ...values
    })
  } catch (error) {
    return {
      error: 'Failed to update card'
    }
  }

  revalidatePath(`/board/${boardId}`)

  return {
    data: id
  }
}

export const updateCard = createSafeAction(updateCardSchema, handler)
