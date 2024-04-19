'use server'

import { auth } from '@clerk/nextjs'
import { doc, updateDoc } from 'firebase/firestore'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/firebaseConfig'

// import { db } from '@/lib/db'
import { updateListSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id, title, boardId } = data

  try {
    const listRef = doc(db, 'lists', id)

    await updateDoc(listRef, {
      title
    })
  } catch (error) {
    return {
      error: 'Failed to update list'
    }
  }

  revalidatePath(`/board/${boardId}`)

  return {
    data: id
  }
}

export const updateList = createSafeAction(updateListSchema, handler)
