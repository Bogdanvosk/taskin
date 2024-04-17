import { create } from 'zustand'

import type { List } from '@/types'

interface ListsState {
  lists: List[]
}

type Action = {
  updateLists: (lists: ListsState['lists']) => void
}

export const useStore = create<ListsState & Action>((set) => ({
  lists: [],
  updateLists: (lists) =>
    set(() => ({
      lists
    }))
}))
