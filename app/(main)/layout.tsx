import { Toaster } from 'sonner'

import { ModalProvider } from '@/components/providers/modal-provider'
import { QueryProvider } from '@/components/providers/query-provider'

import { Navbar } from './_components/navbar'

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
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
