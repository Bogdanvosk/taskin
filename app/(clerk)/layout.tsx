'use client'

import { useRef } from 'react'
import Image from 'next/image'

import { authImage, dogImage } from '@/constants/images'

const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  const authImageRef = useRef<HTMLImageElement>(null)
  const dogImageRef = useRef<HTMLImageElement>(null)

  const onLoadImageAnimation = () => {
    setTimeout(() => {
      const refs = [authImageRef.current, dogImageRef.current]

      refs.forEach((imgRef) => {
        if (imgRef) {
          imgRef.style.transform = 'translateX(0)'
        }
      })
    }, 1000)
  }

  return (
    <div className="h-full flex items-center justify-center relative overflow-x-hidden dark:bg-slate-600">
      <Image
        ref={authImageRef}
        onLoad={onLoadImageAnimation}
        className="hidden xs:block absolute right-[30px] top-[10px] transition translate-x-[110%] duration-500"
        src={authImage}
        alt="Aunthentication"
        width={300}
        height={300}
      />
      <Image
        ref={dogImageRef}
        onLoad={onLoadImageAnimation}
        className="absolute left-[5px] bottom-[5px] transition translate-x-[-100%] duration-500"
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
