'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/db'

import { createCardSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { title, boardId, listId } = data

  // let cardTitle = title

  // if (title === '') {
  //   cardTitle = 'New card'
  // }

  if (!title) {
    return {
      error: 'Title is required'
    }
  }

  let card
  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: {
          userId
        }
      }
    })

    if (!list) {
      return {
        error: 'List not found'
      }
    }

    const lastCard = await db.card.findFirst({
      where: {
        listId
      },
      orderBy: {
        order: 'desc'
      },
      select: {
        order: true
      }
    })

    const newOrder = lastCard ? lastCard.order + 1 : 1

    card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder
      }
    })
  } catch (err) {
    return {
      error: `${err}`
    }
  }

  revalidatePath(`/board/${boardId}`)

  return {
    data: card
  }
}

export const createCard = createSafeAction(createCardSchema, handler)
