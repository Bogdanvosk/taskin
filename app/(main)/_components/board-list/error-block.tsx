import Image from 'next/image'

import { errorImage } from '@/constants/images'

export const ErrorBlock = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-20">
      <p className="text-lg font-bold">Failed to load boards</p>
      <Image src={errorImage} alt="Error" width={500} height={500} />
    </div>
  )
}
