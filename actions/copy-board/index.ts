'use server'

import { auth } from '@clerk/nextjs'
import type { Card } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/db'
import type { ListWithCards } from '@/types'

import { copyBoardSchema } from './schema'
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
    const boardToCopy = await db.board.findUnique({
      where: {
        id,
        userId
      },
      include: {
        lists: {
          include: {
            cards: true
          }
        }
      }
    })

    if (!boardToCopy) {
      return { error: 'Board not found' }
    }

    await db.board.create({
      data: {
        title: `${boardToCopy.title} - Copy`,
        userId: boardToCopy.userId,
        imageId: boardToCopy.imageId,
        imageThumbUrl: boardToCopy.imageThumbUrl,
        imageFullUrl: boardToCopy.imageFullUrl,
        imageUserName: boardToCopy.imageUserName,
        imageLinkHtml: boardToCopy.imageLinkHtml,
        isFavourite: boardToCopy.isFavourite,
        lists: {
          create: boardToCopy.lists.map((list: ListWithCards) => ({
            title: list.title,
            order: list.order,
            cards: {
              create: list.cards.map((card: Card) => ({
                title: card.title,
                description: card.description,
                order: card.order
              }))
            }
          }))
        }
      }
    })
  } catch (err) {
    return {
      error: `Failed to copy board`
    }
  }

  revalidatePath(`/`)
  redirect(`/`)
}

export const copyBoard = createSafeAction(copyBoardSchema, handler)
