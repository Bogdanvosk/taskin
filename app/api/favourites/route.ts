import { auth } from '@clerk/nextjs'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { NextResponse } from 'next/server'

import { db } from '@/lib/firebaseConfig'

export const GET = async () => {
  const { userId } = auth()

  if (!userId) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 })
  }

  try {
    const boardsQ = query(
      collection(db, 'boards'),
      where('userId', '==', userId),
      where('isFavourite', '==', true)
    )

    const data = await getDocs(boardsQ)

    const boards = data.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })

    return NextResponse.json(boards)
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
