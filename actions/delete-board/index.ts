'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/db'

import { deleteBoardSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id } = data

  try {
    await db.board.delete({
      where: {
        id,
        userId
      }
    })
  } catch (error) {
    return {
      error: 'Failed to delete board'
    }
  }

  revalidatePath(`/`)
  redirect(`/`)
}

export const deleteBoard = createSafeAction(deleteBoardSchema, handler)
