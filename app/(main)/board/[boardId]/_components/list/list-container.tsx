'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { debounce } from 'lodash'
import { toast } from 'sonner'

import { updateCardOrder } from '@/actions/update-card-order'
import { updateListOrder } from '@/actions/update-list-order'
import { useAction } from '@/hooks/use-action'
import type { ListWithCards } from '@/types'

import { ListForm } from './list-form'
import { ListItem } from './list-item'

interface ListContainerProps {
  boardId: string
  lists: any
}

const ListContainer = ({ lists, boardId }: ListContainerProps) => {
  console.log('lists', lists);
  
  const [orderedData, setOrderedData] = useState(lists)

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
    setOrderedData(lists)
  }, [lists])

  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list)

    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }
  /*
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
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      )

      setOrderedData(items)

      executeUpdateListOrder({
        items,
        boardId
      })
    }

    // * user moves card
    if (type === 'card') {
      const newOrderedData = [...orderedData]

      const srcList = newOrderedData.find(
        (list) => list.id === source.droppableId
      )

      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      )

      if (!srcList || !destList) return

      if (!srcList.cards) {
        srcList.cards = []
      }

      if (!destList.cards) {
        destList.cards = []
      }

      // * user moves card in the same list
      if (destination.droppableId === source.droppableId) {
        let reorderedCards = reorder(
          srcList.cards,
          source.index,
          destination.index
        )

        reorderedCards = reorderedCards.map((card, index) => ({
          ...card,
          order: index
        }))

        srcList.cards = reorderedCards

        setOrderedData(newOrderedData)

        executeUpdateCardOrder({
          items: reorderedCards,
          boardId
        })
      } else {
        // * remove card from the srcList
        const [removedCard] = srcList.cards.splice(source.index, 1)
        removedCard.listId = destination.droppableId

        // * add card to the destList
        destList.cards.splice(destination.index, 0, removedCard)

        // * update card order for srcList and destList
        srcList.cards.forEach((card, index) => {
          card.order = index
        })

        executeUpdateCardOrder({
          items: srcList.cards,
          boardId
        })

        destList.cards.forEach((card, index) => {
          card.order = index
        })

        executeUpdateCardOrder({
          items: destList.cards,
          boardId
        })

        setOrderedData(newOrderedData)
      }
    }
  }
*/

  const onDragEnd = (result: any) => {}
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full transition"
          >
            {orderedData.map((list: any, index: number) => {
              return <ListItem key={list.id} index={index} data={list} />
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
