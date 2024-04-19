import { auth } from '@clerk/nextjs'
import { doc, getDoc } from 'firebase/firestore'
import { NextResponse } from 'next/server'

import { db } from '@/lib/firebaseConfig'

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId } = auth()

  if (!userId) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 })
  }

  try {
    const cardRef = doc(db, 'cards', params.cardId)

    const card = await getDoc(cardRef)

    return NextResponse.json(card.data())
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
  // try {
  //   const card = await db.card.findUnique({
  //     where: {
  //       id: params.cardId,
  //       list: {
  //         board: {
  //           userId
  //         }
  //       }
  //     },
  //     include: {
  //       list: {
  //         select: {
  //           title: true
  //         }
  //       }
  //     }
  //   })

  //   return NextResponse.json(card)
  // } catch (error) {
  //   return new Response(JSON.stringify(error), { status: 500 })
  // }
}
