import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId } = auth()

  if (!userId) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 })
  }
  try {
    const card = await db.card.findUnique({
      where: {
        id: params.cardId,
        list: {
          board: {
            userId
          }
        }
      },
      include: {
        list: {
          select: {
            title: true
          }
        }
      }
    })

    return NextResponse.json(card)
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
