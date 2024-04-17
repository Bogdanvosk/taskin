'use server'

import { auth } from '@clerk/nextjs'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
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

    const lastList = data.docs
    let lastOrder = 0

    lastList
      .filter((doc) => doc.data().boardId === boardId)
      .sort((a, b) => a.data().order - b.data().order)
      .forEach((doc) => {
        lastOrder = doc.data().order
      })

    const newOrder = lastOrder + 1

    list = await addDoc(collection(db, 'lists'), {
      title,
      boardId,
      order: newOrder
    })

    const listRef = doc(db, 'lists', list.id)

    await updateDoc(listRef, {
      id: list.id
    })
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
