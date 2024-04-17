'use server'

import { auth } from '@clerk/nextjs'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where
} from 'firebase/firestore'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/firebaseConfig'

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
    await deleteDoc(doc(db, 'boards', id))

    const listsQ = query(collection(db, 'lists'), where('boardId', '==', id))

    const data = await getDocs(listsQ)

    const listsToDelete = data.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id
      }
    })

    for (const list of listsToDelete) {
      await deleteDoc(doc(db, 'lists', list.id))

      const cardsQ = query(collection(db, 'cards'), where('boardId', '==', id))

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
    }
  } catch (error) {
    return {
      error: 'Failed to delete board'
    }
  }

  revalidatePath(`/`)
  redirect(`/`)
}

export const deleteBoard = createSafeAction(deleteBoardSchema, handler)
