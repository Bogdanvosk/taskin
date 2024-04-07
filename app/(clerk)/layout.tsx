import Image from 'next/image'

import { authImage, dogImage } from '@/constants/images'

const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center relative">
      <Image
        className="absolute right-[30px] top-[10px]"
        src={authImage}
        alt="Aunthentication"
        width={300}
        height={300}
      />
      <Image
        className="absolute left-[5px] bottom-[5px]"
        src={dogImage}
        alt="Dog"
        width={256}
        height={256}
      />
      {children}
    </div>
  )
}

export default ClerkLayout
