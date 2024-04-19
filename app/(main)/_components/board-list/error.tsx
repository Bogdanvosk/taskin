import Image from 'next/image'

import { errorImage } from '@/constants/images'
import { cn } from '@/lib/utils'

interface ErrorProps {
  text: string
  width?: number
  height?: number
  className?: string
}

export const Error = ({
  text,
  width = 500,
  height = 500,
  className
}: ErrorProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full gap-20',
        className
      )}
    >
      <p className="text-2xl dark:text-white">{text}</p>
      <Image src={errorImage} alt="Error" width={width} height={height} />
    </div>
  )
}
