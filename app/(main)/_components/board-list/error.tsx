import Image from 'next/image'

import { errorImage } from '@/constants/images'
import { cn } from '@/lib/utils'

interface ErrorProps {
  message: string
  className?: string
  width?: number
  height?: number
}

export const Error = ({
  message,
  className,
  width = 500,
  height = 500
}: ErrorProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full gap-20',
        className
      )}
    >
      <p className="text-2xl dark:text-white">{message}</p>
      <Image src={errorImage} alt="Error" width={width} height={height} />
    </div>
  )
}
