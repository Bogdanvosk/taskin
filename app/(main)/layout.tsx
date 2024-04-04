import { Toaster } from 'sonner'

import { Navbar } from './_components/navbar'

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Toaster />
      <Navbar />
      {children}
    </div>
  )
}

export default BoardLayout
