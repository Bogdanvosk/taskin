import Image from 'next/image'
import { Toaster } from 'sonner'

import { ModalProvider } from '@/components/providers/modal-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { catImage } from '@/constants/images'

import { Navbar } from './_components/navbar'

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-full overflow-x-hidden z-0">
      <Image
        className="absolute left-[5px] bottom-[5px]"
        src={catImage}
        alt="Cat"
        width={256}
        height={256}
      />
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        <Navbar />
        {children}
      </QueryProvider>
    </div>
  )
}

export default BoardLayout
