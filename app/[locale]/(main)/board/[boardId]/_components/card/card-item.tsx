'use client'

import { Draggable } from '@hello-pangea/dnd'
import type { Card } from '@prisma/client'

import { useCardModal } from '@/hooks/use-card-modal'

interface CardItemProps {
  data: Card
  index: number
}

export const CardItem = ({ data, index }: CardItemProps) => {
  const { onOpen } = useCardModal()

  return (
    <>
      <Draggable draggableId={data.id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            role="button"
            onClick={() => onOpen(data.id)}
            className="truncate border-2 border-transparent hover:border-black/50 py-2 px-3 text-sm bg-white shadow-sm rounded-md transition-colors"
          >
            {data.title}
          </div>
        )}
      </Draggable>
    </>
  )
}
