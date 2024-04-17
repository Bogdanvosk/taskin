'use server'

import { auth } from '@clerk/nextjs'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/firebaseConfig'

// import { db } from '@/lib/db'
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
    // const board = await db.board.findUnique({
    //   where: {
    //     id: boardId,
    //     userId
    //   }
    // })

    const boardsRef = collection(db, 'boards')
    const boardQ = query(boardsRef, where('userId', '==', userId))

    const boardData = await getDocs(boardQ)

    const board = boardData.docs.filter((doc) => doc.id === boardId)[0].data()

    if (!board) {
      return {
        error: 'Board not found'
      }
    }

    const listsRef = collection(db, 'lists')
    const data = await getDocs(listsRef)

    const lastList = data.docs.filter((doc) => doc.id === boardId)

    // const lastList = await db.list.findFirst({
    //   where: {
    //     boardId
    //   },
    //   orderBy: {
    //     order: 'desc'
    //   },
    //   select: {
    //     order: true
    //   }
    // })

    const newOrder = lastList.length > 0 ? lastList[0].data().order + 1 : 1

    list = await addDoc(collection(db, 'lists'), {
      title,
      boardId,
      order: newOrder
    })

    // list = await db.list.create({
    //   data: {
    //     title,
    //     boardId,
    //     order: newOrder
    //   }
    // })
  } catch (err) {
    return {
      error: 'Failed to create list'
    }
  }

  revalidatePath(`/board/${boardId}`)

  return {
    data: list.id
  }
}

export const createList = createSafeAction(createListSchema, handler)
