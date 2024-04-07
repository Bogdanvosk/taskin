import { Suspense } from 'react'

import { BoardList } from './_components/board-list'
import { SkeletonBoardList } from './_components/board-list/skeleton'

const MainPage = () => {
  return (
    <div className="w-full mb-20 px-4 pt-16 scrollbar">
      <Suspense fallback={<SkeletonBoardList />}>
        <BoardList />
      </Suspense>
    </div>
  )
}

export default MainPage
