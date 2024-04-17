import { auth } from '@clerk/nextjs'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { redirect } from 'next/navigation'

import { db } from '@/lib/firebaseConfig'
import type { List } from '@/types'

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

  const listsQ = query(
    collection(db, 'lists'),
    where('boardId', '==', params.boardId)
  )

  const data = await getDocs(listsQ)

  const lists = data.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })

  const cards = []
  const getCards = async (listId: string) => {
    const cardsQ = query(collection(db, 'cards'), where('listId', '==', listId))

    const data = await getDocs(cardsQ)

    return data
  }

  for (let i = 0; i < lists.length; i++) {
    const data = await getCards(lists[i].id)

    cards.push(
      data.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
    )
  }

  // lists.forEach((list) => {})

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
      <ListContainer
        boardId={params.boardId}
        lists={lists as List[]}
        cards={cards}
      />
    </div>
  )
}

export default BoardIdPage
