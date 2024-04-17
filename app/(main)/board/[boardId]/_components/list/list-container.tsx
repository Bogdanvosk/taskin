'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'

// import { debounce } from 'lodash'
// import { toast } from 'sonner'
// import { updateCardOrder } from '@/actions/update-card-order'
import { updateListOrder } from '@/actions/update-list-order'
// import { useAction } from '@/hooks/use-action'
import type { Card, List, ListWithCards } from '@/types'

import { ListForm } from './list-form'
import { ListItem } from './list-item'
import { toast } from 'sonner'
import { useAction } from '@/hooks/use-action'
import { useParams } from 'next/navigation'
import { debounce } from 'lodash'
import { updateCardOrder } from '@/actions/update-card-order'

// TODO: remove props drilling using context
interface ListContainerProps {
  lists: List[]
  cards: any
}

const ListContainer = ({ lists, cards }: ListContainerProps) => {
  const [orderedLists, setOrderedLists] = useState<List[] | ListWithCards[]>(
    lists
  )
  const [orderedCards, setOrderedCards] = useState(cards)

  const { boardId } = useParams()

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success(`Lists reordered`)
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: debounce(() => toast.success(`Cards reordered`), 250),
    onError: (error) => {
      toast.error(error)
    }
  })

  useEffect(() => {
    setOrderedLists(lists)
    setOrderedCards(cards)
  }, [lists, cards])

  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list)

    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result

    if (!destination) return

    // * if position where dropped has not changed
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // * user moves list
    if (type === 'list') {
      const items = reorder(orderedLists, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      )

      setOrderedLists(items)

      executeUpdateListOrder({
        items,
        boardId: boardId as string
      })
    }

    // * user moves card
    if (type === 'card') {
      let newOrderedLists = [...orderedLists]
      const newOrderedCards = [...orderedCards]

      console.log('cards', cards)

      let sourceList = cards.find(
        (list: Card[]) => list[0].listId === source.droppableId
      )

      let destinationList = cards.find((list: Card[]) => {
        if (!list[0]) return []
        list[0].listId === destination.droppableId
      })

      console.log('destinationList', destinationList)

      // const srcList = newOrderedLists.find(
      //   (list) => list.id === source.droppableId
      // )

      // const destList = newOrderedLists.find(
      //   (list) => list.id === destination.droppableId
      // )

      // if (!sourceList || !destinationList) return

      if (!sourceList) {
        sourceList = []
      }

      // if (!destinationList) {
      //   destinationList = []
      // }

      // * user moves card in the same list
      if (destination.droppableId === source.droppableId) {
        let reorderedCards: Card[] = reorder(
          sourceList,
          source.index,
          destination.index
        )

        // console.log('reorderedCards', reorderedCards)

        reorderedCards = reorderedCards.map((card, index) => ({
          ...card,
          order: index
        }))

        sourceList = reorderedCards

        setOrderedCards(newOrderedCards)

        // @ts-ignore
        newOrderedLists.find((list) => list.id === source.droppableId)!.cards =
          reorderedCards

        setOrderedLists(newOrderedLists)

        executeUpdateCardOrder({
          items: reorderedCards,
          boardId: boardId as string
        })

        // TODO: 
      } else {
        // * remove card from the sourceList
        const [removedCard] = sourceList.splice(source.index, 1)
        removedCard.listId = destination.droppableId

        console.log('removedCard', removedCard)

        // * add card to the destinationList
        destinationList.splice(destination.index, 0, removedCard)

        // * update card order for sourceList and destinationList
        sourceList.forEach((card: Card, index: number) => {
          card.order = index
        })

        executeUpdateCardOrder({
          items: sourceList,
          boardId: boardId as string
        })

        destinationList.forEach((card: Card, index: number) => {
          card.order = index
        })

        executeUpdateCardOrder({
          items: destinationList,
          boardId: boardId as string
        })

        setOrderedLists(newOrderedLists)
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full transition"
          >
            {orderedLists.map((list: any, index: number) => {
              return (
                <ListItem
                  key={list.id}
                  index={index}
                  data={list}
                  cards={orderedCards[index]}
                />
              )
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ListContainer
