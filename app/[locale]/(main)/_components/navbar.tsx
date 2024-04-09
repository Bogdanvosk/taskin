import { useIntl } from 'react-intl'
import { UserButton } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { FormPopover } from '@/components/form/form-popover'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'

export const Navbar = () => {
  const intl = useIntl()
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()

  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <FormPopover align="start" side="right" sideOffset={10}>
          <Button
            variant="primary"
            size="sm"
            className="rounded-sm hidden md:block h-auto py-1.5 px-2"
          >
            {intl.formatMessage({ id: 'create_button' })}
          </Button>
        </FormPopover>
        <FormPopover align="start" side="bottom" sideOffset={10}>
          <Button
            variant="primary"
            size="sm"
            className="rounded-sm block md:hidden"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </FormPopover>
        {pathname !== `/${params.locale}` && (
          <Button
            variant="primary"
            size="sm"
            className="rounded-sm md:h-auto md:py-1.5 md:px-2"
            onClick={() => router.push(`/${params.locale}`)}
          >
            {intl.formatMessage({ id: 'navbar_all_boards' })}
          </Button>
        )}
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30
              }
            }
          }}
        />
      </div>
    </nav>
  )
}