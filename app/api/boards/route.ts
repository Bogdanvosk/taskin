import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'

export const GET = async () => {
  const { userId } = auth()

  if (!userId) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 })
  }

  try {
    const boards = await db.board.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(boards)
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
