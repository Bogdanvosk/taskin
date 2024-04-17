'use server'

import { auth } from '@clerk/nextjs'
// import type { Card } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createSafeAction } from '@/lib/create-safe-action'

// import { db } from '@/lib/db'
// import type { ListWithCards } from '@/types'
import { copyBoardSchema } from './schema'
import type { InputType, ReturnType } from './types'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id } = data
  let board
  try {
    const boardRef = doc(db, 'boards', id)
    const boardToCopy = await getDoc(boardRef)

    const listsQ = query(collection(db, 'lists'), where('boardId', '==', id))

    const data = await getDocs(listsQ)

    const listsToCopy = data.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })

    if (!boardToCopy.data() || !listsToCopy) {
      return { error: 'Board not found' }
    }

    board = await addDoc(collection(db, 'boards'), {
      title: `${boardToCopy.data()?.title} - Copy`,
      userId: boardToCopy.data()?.userId,
      imageId: boardToCopy.data()?.imageId,
      imageThumbUrl: boardToCopy.data()?.imageThumbUrl,
      imageFullUrl: boardToCopy.data()?.imageFullUrl,
      imageUserName: boardToCopy.data()?.imageUserName,
      imageLinkHtml: boardToCopy.data()?.imageLinkHtml,
      isFavourite: boardToCopy.data()?.isFavourite
    })

    for (let i = 0; i < listsToCopy.length; i++) {
      await addDoc(collection(db, 'lists'), {
        ...listsToCopy[i],
        boardId: board.id
      })

      // TODO: copying cards
      // await addDoc(collection(db, 'cards'), {
      //   ...listsToCopy[i],
      //   listId: listsToCopy[i].id
      // })
    }
  } catch (error) {
    return {
      error: `Failed to copy board`
    }
  }

  // try {
  //   const boardToCopy = await db.board.findUnique({
  //     where: {
  //       id,
  //       userId
  //     },
  //     include: {
  //       lists: {
  //         include: {
  //           cards: true
  //         }
  //       }
  //     }
  //   })

  //   if (!boardToCopy) {
  //     return { error: 'Board not found' }
  //   }

  //   await db.board.create({
  //     data: {
  //       title: `${boardToCopy.title} - Copy`,
  //       userId: boardToCopy.userId,
  //       imageId: boardToCopy.imageId,
  //       imageThumbUrl: boardToCopy.imageThumbUrl,
  //       imageFullUrl: boardToCopy.imageFullUrl,
  //       imageUserName: boardToCopy.imageUserName,
  //       imageLinkHtml: boardToCopy.imageLinkHtml,
  //       isFavourite: boardToCopy.isFavourite
  //       // lists: {
  //       //   create: boardToCopy.lists.map((list: ListWithCards) => ({
  //       //     title: list.title,
  //       //     order: list.order,
  //       //     cards: {
  //       //       create: list.cards.map((card: Card) => ({
  //       //         title: card.title,
  //       //         description: card.description,
  //       //         order: card.order
  //       //       }))
  //       //     }
  //       //   }))
  //       // }
  //     }
  //   })
  // } catch (err) {
  //   return {
  //     error: `Failed to copy board`
  //   }
  // }

  revalidatePath(`/`)
  redirect(`/`)
}

export const copyBoard = createSafeAction(copyBoardSchema, handler)
