'use client'

import { useQuery } from '@tanstack/react-query'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCardModal } from '@/hooks/use-card-modal'
import { fetcher } from '@/lib/fetcher'
import type { CardWithList } from '@/types'

import { Description } from './description'
import { Header } from './header'

interface CardModalProps {
  card: CardWithList
  list: string
}

export const CardModal = () => {
  const id = useCardModal((state) => state.id)
  const isOpen = useCardModal((state) => state.isOpen)
  const onClose = useCardModal((state) => state.onClose)

  const { data: cardData } = useQuery<CardModalProps>({
    queryKey: ['card', id],
    queryFn: () => fetcher(`/api/cards/${id}`)
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className="grid grid-coks-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full splace-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData.card} />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
