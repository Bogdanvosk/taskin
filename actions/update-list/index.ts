'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/db'

import { updateListSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { title, id, boardId } = data

  let list

  try {
    list = await db.list.update({
      where: {
        id,
        boardId,
        board: {
          userId
        }
      },
      data: {
        title
      }
    })
  } catch (error) {
    return {
      error: 'Failed to update list'
    }
  }

  revalidatePath(`/board/${boardId}`)

  return {
    data: list
  }
}

export const updateList = createSafeAction(updateListSchema, handler)
