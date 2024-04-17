import { auth } from '@clerk/nextjs'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { notFound } from 'next/navigation'

import { db } from '@/lib/firebaseConfig'

import { BoardNavbar } from './_components/board/board-navbar'

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

  const boardsRef = collection(db, 'boards')
  const q = query(boardsRef, where('userId', '==', userId))

  const data = await getDocs(q)

  const board = data.docs.find((doc) => doc.id === params.boardId)?.data()

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
