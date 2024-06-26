import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'

import ListContainer from './_components/list/list-container'

interface BoardIdPageProps {
  params: {
    boardId: string
  }
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        userId
      }
    },
    include: {
      cards: {
        orderBy: {
          order: 'asc'
        }
      }
    },
    orderBy: {
      order: 'asc'
    }
  })

  return (
    <div className="relative p-4 h-full overflow-x-auto scrollbar">
      <ListContainer boardId={params.boardId} data={lists} />
    </div>
  )
}

export default BoardIdPage
