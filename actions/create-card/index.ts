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
import { createCardSchema } from './schema'
import type { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { title, boardId, listId, description } = data

  if (!title) {
    return {
      error: 'Title is required'
    }
  }

  let card
  try {
    const listsRef = collection(db, 'lists')
    const listsQ = query(listsRef, where('boardId', '==', boardId))

    const listsData = await getDocs(listsQ)

    const list = listsData.docs.filter((doc) => doc.id === listId)[0].data()

    if (!list) {
      return {
        error: 'List not found'
      }
    }

    const cardsRef = collection(db, 'cards')
    const data = await getDocs(cardsRef)

    // const lastCard = data.docs.filter((doc) => doc.id === boardId)

    // const newOrder = lastCard.length > 0 ? lastCard[0].data().order + 1 : 1

    const lastCard = data.docs
    let lastOrder = 0

    lastCard
      .filter((doc) => doc.data().listId === listId)
      .sort((a, b) => a.data().order - b.data().order)
      .forEach((doc) => {
        lastOrder = doc.data().order
      })

    const newOrder = lastOrder + 1

    card = await addDoc(collection(db, 'cards'), {
      title,
      listId,
      description,
      boardId: list.boardId,
      order: newOrder
    })
    const cardRef = doc(db, 'cards', card.id)

    await updateDoc(cardRef, {
      id: card.id
    })
  } catch (err) {
    return {
      error: `${err}`
    }
  }

  revalidatePath(`/board/${boardId}`)

  return {
    data: card.id
  }
}

export const createCard = createSafeAction(createCardSchema, handler)
