'use client'

import type { ElementRef } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd'

import type { Card, List, ListWithCards } from '@/types'

import { CardForm } from '../card/card-form'
import { CardItem } from '../card/card-item'

import { ListHeader } from './list-header'

interface ListItemProps {
  data: any
  index: number
  cards: Card[]
}

export const ListItem = ({ data, index, cards }: ListItemProps) => {
  const [filteredCards, setFilteredCards] = useState<Card[]>(cards)

  useEffect(() => {
    if (!data.cards) {
      const sorted = cards.sort((a, b) => a.order - b.order)
      setFilteredCards(sorted)
    }
  }, [cards])

  const inputRef = useRef<ElementRef<'input'>>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isListHeaderEditing, setIsListHeaderEditing] = useState(false)

  const disableEditing = () => {
    setIsEditing(false)
  }

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
    })
  }

  return (
    <Draggable
      isDragDisabled={isListHeaderEditing || isEditing}
      draggableId={data.id}
      index={index}
    >
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2 dark:bg-slate-600"
          >
            {/* TODO: add divided function callback */}
            <ListHeader
              onChangeIsEditing={(isListHeaderEditing: boolean) => {
                setIsListHeaderEditing(isListHeaderEditing)
              }}
              onAddCard={enableEditing}
              data={data}
            />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="mx-1 px-1 py-0.5 flex flex-col gap-y-2"
                >
                  {!data.cards
                    ? filteredCards.map((card, index) => (
                        <CardItem index={index} key={card.id} data={card} />
                      ))
                    : data.cards.map((card: Card, index: number) => (
                        <CardItem index={index} key={card.id} data={card} />
                      ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={data.id}
              ref={inputRef}
              isEditing={isEditing}
              disableEditing={disableEditing}
              enableEditing={enableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  )
}
