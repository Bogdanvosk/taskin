'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Toaster } from 'sonner'

import { QueryProvider } from '@/components/providers/query-provider'
import { catImage } from '@/constants/images'

import { Navbar } from './_components/navbar'

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  const catImageRef = useRef<HTMLImageElement>(null)

  const onLoadImageAnimation = () => {
    setTimeout(() => {
      if (catImageRef.current) {
        catImageRef.current.style.transform = 'translateX(0)'
      }
    }, 1000)
  }
  return (
    <div className="relative h-full overflow-x-hidden z-0">
      <Image
        ref={catImageRef}
        className="absolute left-[5px] bottom-[5px] transition translate-x-[-100%] duration-500"
        onLoad={onLoadImageAnimation}
        src={catImage}
        alt="Cat"
        width={256}
        height={256}
      />
      <QueryProvider>
        <Toaster />
        <Navbar />
        {children}
      </QueryProvider>
    </div>
  )
}

export default BoardLayout
