'use server'

import { auth } from '@clerk/nextjs'
// import type { Card } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
// import { db } from '@/lib/db'

import { copyListSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id, boardId } = data
  let list

  // try {
  //   const listToCopy = await db.list.findUnique({
  //     where: {
  //       id,
  //       boardId,
  //       board: {
  //         userId
  //       }
  //     },
  //     include: {
  //       cards: true
  //     }
  //   })

  //   if (!listToCopy) {
  //     return { error: 'List not found' }
  //   }

  //   const lastList = await db.list.findFirst({
  //     where: { boardId },
  //     orderBy: { order: 'desc' },
  //     select: { order: true }
  //   })

  //   const newOrder = lastList ? lastList.order + 1 : 1

  //   list = await db.list.create({
  //     data: {
  //       boardId: listToCopy.boardId,
  //       title: `${listToCopy.title} - Copy`,
  //       order: newOrder,
  //       cards: {
  //         create: listToCopy.cards.map((card: Card) => ({
  //           title: card.title,
  //           description: card.description,
  //           order: card.order
  //         }))
  //       }
  //     },
  //     include: {
  //       cards: true
  //     }
  //   })
  // } catch (error) {
  //   return {
  //     error: `Failed to copy list`
  //   }
  // }

  revalidatePath(`/board/${boardId}`)
  return { data: list }
}

export const copyList = createSafeAction(copyListSchema, handler)
