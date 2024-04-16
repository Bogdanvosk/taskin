import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import ListContainer from './_components/list/list-container'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

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

  const listsQ = query(
    collection(db, 'lists'),
    where('boardId', '==', params.boardId)
  )

  const data = await getDocs(listsQ)

  const lists = data.docs.map((doc) => {
    return {
      id: doc.id,
      // cards,
      ...doc.data()
    }
  })

  // lists.forEach(async (list) => {
  //   const cardsQ = query(
  //     collection(db, 'cards'),
  //     where('listId', '==', list.id)
  //   )

  //   const data = await getDocs(cardsQ)

  //   data.docs.forEach((doc) => console.log(doc.data()))

  //   cards.push(
  //     data.docs.map((doc) => {
  //       id: doc.id,
  //         ...doc.data()
  //     })
  //   )
  // })
  


  // const lists = await db.list.findMany({
  //   where: {
  //     boardId: params.boardId,
  //     board: {
  //       userId
  //     }
  //   },
  //   include: {
  //     cards: {
  //       orderBy: {
  //         order: 'asc'
  //       }
  //     }
  //   },
  //   orderBy: {
  //     order: 'asc'
  //   }
  // })

  return (
    <div className="relative p-4 h-full overflow-x-auto scrollbar">
      <ListContainer boardId={params.boardId} lists={lists} />
    </div>
  )
}

export default BoardIdPage
