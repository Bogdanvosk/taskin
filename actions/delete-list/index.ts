'use server'

import { auth } from '@clerk/nextjs'
import {
  collection,
  deleteDoc,
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
import { deleteListSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id, boardId } = data
  try {
    await deleteDoc(doc(db, 'lists', id))

    const cardsQ = query(collection(db, 'cards'), where('listId', '==', id))

    const data = await getDocs(cardsQ)

    const cardsToDelete = data.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id
      }
    })

    for (const card of cardsToDelete) {
      await deleteDoc(doc(db, 'cards', card.id))
    }

    const listsRef = collection(db, 'lists')
    const listsData = await getDocs(listsRef)

    const listsToUpdate = listsData.docs
      .map((doc) => {
        return {
          ...doc.data(),
          id: doc.id
        }
      })
      // @ts-ignore
      .filter((list) => list.boardId === boardId)
      // @ts-ignore
      .sort((a, b) => a.order - b.order)

    for (let i = 0; i < listsToUpdate.length; i++) {
      await updateDoc(doc(db, 'lists', listsToUpdate[i].id), {
        order: i + 1
      })
    }
  } catch (error) {
    return {
      error: 'Failed to delete list'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: id }
}

export const deleteList = createSafeAction(deleteListSchema, handler)
