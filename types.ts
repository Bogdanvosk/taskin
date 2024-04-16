export interface Board {
  id: string
  title: string
  userId: string
  imageId: string
  imageThumbUrl: string
  imageFullUrl: string
  imageUserName: string
  imageLinkHtml: string
  isFavourite: boolean
}

export interface List {
  id: string
  title: string
  order: number
  boardId: string
}

export interface Card {
  id: string
  title: string
  order: number
  description?: string | null
  listId: string
}

export type ListWithCards = List & {
  cards: Card[]
}

export type CardWithList = Card & {
  list: List
}
