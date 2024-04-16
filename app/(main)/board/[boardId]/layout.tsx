import { auth } from '@clerk/nextjs'
import { notFound } from 'next/navigation'

// import { db } from '@/lib/db'

import { BoardNavbar } from './_components/board/board-navbar'
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

export async function generateMetadata({
  params
}: {
  params: { boardId: string }
}) {
  const { userId } = auth()
  if (!userId) {
    return {
      title: 'Board'
    }
  }

  const boardsRef = collection(db, 'boards')
  const q = query(boardsRef, where('userId', '==', userId))

  const data = await getDocs(q)

  const board = data.docs.filter((doc) => doc.id === params.boardId)[0].data()

  return {
    title: board?.title || 'Board'
  }
}

const BoardIdLayout = async ({
  children,
  params
}: {
  children: React.ReactNode
  params: { boardId: string }
}) => {
  const { userId } = auth()

  // const board = await db.board.findUnique({
  //   where: {
  //     id: params.boardId,
  //     userId
  //   }
  // })

  const boardsRef = collection(db, 'boards')
  const q = query(boardsRef, where('userId', '==', userId))

  const data = await getDocs(q)

  const board = data.docs.filter((doc) => doc.id === params.boardId)[0].data()

  if (!board) {
    notFound()
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar data={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  )
}

export default BoardIdLayout
