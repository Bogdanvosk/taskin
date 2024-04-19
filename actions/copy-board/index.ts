'use server'

import { auth } from '@clerk/nextjs'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
// import type { Card } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/firebaseConfig'

// import { db } from '@/lib/db'
// import type { ListWithCards } from '@/types'
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
  let board
  try {
    const boardRef = doc(db, 'boards', id)
    const boardToCopy = await getDoc(boardRef)

    const listsQ = query(collection(db, 'lists'), where('boardId', '==', id))

    const listsData = await getDocs(listsQ)

    const listsToCopy = listsData.docs.map((doc) => {
      return {
        id: doc.id,
        title: doc.data().title,
        order: doc.data().order
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

    for (const list of listsToCopy) {
      const newList = await addDoc(collection(db, 'lists'), {
        ...list,
        boardId: board.id
      })

      await updateDoc(doc(db, 'lists', newList.id), {
        id: newList.id
      })

      const cardsQ = query(
        collection(db, 'cards'),
        where('listId', '==', list.id)
      )

      const data = await getDocs(cardsQ)

      const cardsToCopy = data.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id
        }
      })

      for (const card of cardsToCopy) {
        await addDoc(collection(db, 'cards'), {
          ...card,
          listId: newList.id,
          boardId: board.id
        })
      }
    }
  } catch (error) {
    return {
      error: `Failed to copy board`
    }
  }

  revalidatePath(`/`)
  redirect(`/`)
}

export const copyBoard = createSafeAction(copyBoardSchema, handler)
