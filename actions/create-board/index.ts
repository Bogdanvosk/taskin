'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'
// import { db } from '@/lib/db'

import { db } from '@/lib/firebaseConfig'

import { createBoardSchema } from './schema'
import type { InputType, ReturnType } from './types'

import { addDoc, collection, doc, setDoc } from 'firebase/firestore'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { title, image } = data
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUserName] =
    image.split('|')

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHtml ||
    !imageUserName
  ) {
    return {
      error: 'Missing fields. Failed to create board'
    }
  }
  let board
  try {
    board = await addDoc(collection(db, 'boards'), {
      title,
      userId,
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageLinkHtml,
      imageUserName,
      isFavourite: false
    })

    // console.log('Document written with ID: ', board)

  } catch (error) {
    return {
      error: 'Failed to create board'
    }
  }

  revalidatePath(`/board/${board.id}`)

  return {
    data: board.id
  }
}

export const createBoard = createSafeAction(createBoardSchema, handler)
