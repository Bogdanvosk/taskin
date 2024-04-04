'use client'

import type { ElementRef } from 'react'
import { useRef, useState } from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd'

import { cn } from '@/lib/utils'
import type { ListWithCards } from '@/types'

import { CardForm } from './card-form'
import { CardItem } from './card-item'
import { ListHeader } from './list-header'

interface ListItemProps {
  data: ListWithCards
  index: number
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const textareaRef = useRef<ElementRef<'textarea'>>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isListHeaderEditing, setIsListHeaderEditing] = useState(false)

  const disableEditing = () => {
    setIsEditing(false)
  }

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }

  return (
    <Draggable
      isDragDisabled={isListHeaderEditing || isEditing}
      draggableId={data.id}
      index={index}
      disableInteractiveElementBlocking
    >
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            {/* TODO: add divided function callback */}
            <ListHeader
              onChangeIsEditing={(isListHeaderEditing: boolean) => {
                setIsListHeaderEditing(isListHeaderEditing)
              }}
              onAddCard={enableEditing}
              data={data}
            />
            <Droppable droppableId={data.id} type="card" direction="vertical">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    'mx-1 px-1 py-0.5 flex flex-col gap-y-2',
                    data.cards.length > 0 ? 'mt-2' : 'mt-0'
                  )}
                >
                  {data.cards.map((card, index) => (
                    <CardItem key={card.id} index={index} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={data.id}
              ref={textareaRef}
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
