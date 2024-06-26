'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/db'

import { createListSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { title, boardId } = data

  let list
  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        userId
      }
    })

    if (!board) {
      return {
        error: 'Board not found'
      }
    }

    const lastList = await db.list.findFirst({
      where: {
        boardId
      },
      orderBy: {
        order: 'desc'
      },
      select: {
        order: true
      }
    })

    const newOrder = lastList ? lastList.order + 1 : 1

    list = await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder
      }
    })
  } catch (err) {
    return {
      error: 'Failed to create list'
    }
  }

  revalidatePath(`/board/${boardId}`)

  return {
    data: list
  }
}

export const createList = createSafeAction(createListSchema, handler)
