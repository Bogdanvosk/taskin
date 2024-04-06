'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/db'

import { updateCardSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id, boardId, ...values } = data

  let card
  try {
    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            userId
          }
        }
      },
      data: {
        ...values
      }
    })
  } catch (error) {
    return {
      error: 'Failed to update card'
    }
  }

  revalidatePath(`/board/${boardId}`)

  return {
    data: card
  }
}

export const updateCard = createSafeAction(updateCardSchema, handler)
