import { Suspense } from 'react'

import { BoardList } from './_components/board-list'

const DashboardPage = () => {
  return (
    <div className="w-full mb-20 px-4 mt-16">
      <Suspense fallback={<BoardList.Skeleton />}>
        <BoardList />
      </Suspense>
    </div>
  )
}

export default DashboardPage
