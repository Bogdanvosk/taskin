import { auth } from '@clerk/nextjs'
import { notFound } from 'next/navigation'

import ServerIntlProvider from '@/components/providers/server-intl-provider'
import { db } from '@/lib/db'
import getIntl from '@/lib/intl'

import { BoardNavbar } from './_components/board/board-navbar'

interface BoardIdLayoutProps {
  children: React.ReactNode
  params: { boardId: string; locale: string }
}

type MetaDataProps = Pick<BoardIdLayoutProps, 'params'>

export async function generateMetadata({ params }: MetaDataProps) {
  const intl = await getIntl(params.locale, 'board_page')

  const { userId } = auth()
  if (!userId) {
    return {
      title: intl.formatMessage({ id: 'meta_board' })
    }
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      userId
    }
  })

  return {
    title: board?.title || intl.formatMessage({ id: 'meta_board' })
  }
}

const BoardIdLayout = async ({ children, params }: BoardIdLayoutProps) => {
  const { userId } = auth()
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      userId
    }
  })

  if (!board) {
    notFound()
  }

  const intl = await getIntl(params.locale, 'board_page')

  return (
    <ServerIntlProvider messages={intl.messages} locale={params.locale}>
      <div
        className="relative h-full bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      >
        <BoardNavbar data={board} />
        <div className="absolute inset-0 bg-black/10" />
        <main className="relative pt-28 h-full">{children}</main>
      </div>
    </ServerIntlProvider>
  )
}

export default BoardIdLayout
