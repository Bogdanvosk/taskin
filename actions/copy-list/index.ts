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

import { createSafeAction } from '@/lib/create-safe-action'
import { db } from '@/lib/firebaseConfig'

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

  const listRef = doc(db, 'lists', id)
  const listToCopy = await getDoc(listRef)

  const cardsQ = query(collection(db, 'cards'), where('listId', '==', id))

  const cardsData = await getDocs(cardsQ)

  const cardsToCopy = cardsData.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id
    }
  })

  if (!listToCopy.data() || !cardsToCopy) {
    return { error: 'List not found' }
  }

  const listsRef = collection(db, 'lists')
  const listsData = await getDocs(listsRef)

  const lastList = listsData.docs
  let lastOrder = 0

  lastList
    .filter((doc) => doc.data().boardId === boardId)
    .sort((a, b) => a.data().order - b.data().order)
    .forEach((doc) => {
      lastOrder = doc.data().order
    })

  const newOrder = lastOrder + 1

  const list = await addDoc(collection(db, 'lists'), {
    title: `${listToCopy.data()?.title} - Copy`,
    boardId: listToCopy.data()?.boardId,
    order: newOrder
  })

  for (const card of cardsToCopy) {
    const newCard = await addDoc(collection(db, 'cards'), {
      ...card,
      listId: list.id,
      boardId: listToCopy.data()?.boardId
    })

    await updateDoc(doc(db, 'cards', newCard.id), {
      id: newCard.id
    })
  }

  revalidatePath(`/board/${boardId}`)
  return { data: id }
}

export const copyList = createSafeAction(copyListSchema, handler)
