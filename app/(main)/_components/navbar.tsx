'use client'

import { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Moon, Plus, Sun } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useDarkMode } from 'usehooks-ts'

import { FormPopover } from '@/components/form/form-popover'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const { isDarkMode, enable, disable } = useDarkMode()
  const [mounted, setMounted] = useState(false)

  const router = useRouter()

  const pathname = usePathname()

  const onChangeTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
      disable()
    } else {
      enable()
      setTheme('dark')
    }
  }

  useEffect(() => {
    if (isDarkMode) setTheme('dark')
    else setTheme('light')

    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b dark:border-none shadow-sm dark:shadow-md bg-white dark:bg-slate-700 flex items-center">
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
            Create
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
        {pathname !== '/' && (
          <Button
            variant="primary"
            size="sm"
            className="rounded-sm md:h-auto md:py-1.5 md:px-2"
            onClick={() => router.push('/')}
          >
            All boards
          </Button>
        )}
      </div>
      <div className="ml-auto flex items-center gap-x-5">
        <button
          onClick={onChangeTheme}
          className="dark:bg-slate-800 bg-slate-400 dark:hover:bg-slate-500 hover:bg-slate-600 transition p-1 flex items-center gap-x-4 rounded-3xl"
        >
          {theme && (
            <Moon
              className={cn(
                'h-6 w-6 transition',
                theme === 'dark'
                  ? 'opacity-0 translate-x-14'
                  : 'opacity-100 translate-x-0'
              )}
            />
          )}
          {theme && (
            <Sun
              className={cn(
                'h-6 w-6 transition',
                theme === 'light'
                  ? 'opacity-0 -translate-x-14'
                  : 'opacity-100 translate-x-0'
              )}
            />
          )}
        </button>
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
