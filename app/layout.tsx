import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import { AuthThemeProvider } from '@/components/providers/auth-theme-provider'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: [
    {
      url: '/logo.png',
      href: '/logo.png'
    }
  ]
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <AuthThemeProvider>
        <body className={cn(inter.className)}>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </body>
      </AuthThemeProvider>
    </html>
  )
}
