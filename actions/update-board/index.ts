'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'

import { updateBoardSchema } from './schema'
import type { InputType, ReturnType } from './types'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { title, id } = data

  let board

  try {
    const boardRef = doc(db, 'boards', id)

    board = await updateDoc(boardRef, {
      title
    })
  } catch (error) {
    return {
      error: 'Failed to update board'
    }
  }

  revalidatePath(`/board/${id}`)

  return {
    data: id
  }
}

export const updateBoard = createSafeAction(updateBoardSchema, handler)
