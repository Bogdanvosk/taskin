import { Toaster } from 'sonner'

import { ModalProvider } from '@/components/providers/modal-provider'

import { Navbar } from './_components/navbar'

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Toaster />
      <ModalProvider />
      <Navbar />
      {children}
    </div>
  )
}

export default BoardLayout
