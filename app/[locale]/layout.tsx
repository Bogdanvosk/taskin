import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { clerkLangs } from '@/clerkLangs'
import ServerIntlProvider from '@/components/providers/server-intl-provider'
import { siteConfig } from '@/config/site'
import getIntl from '@/lib/intl'

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

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const intl = await getIntl(params.locale, 'home')

  const clerkLocalization = clerkLangs.get(params.locale)

  return (
    <html lang={params.locale}>
      <ClerkProvider localization={clerkLocalization}>
        <ServerIntlProvider messages={intl.messages} locale={params.locale}>
          <body className={inter.className}>{children}</body>
        </ServerIntlProvider>
      </ClerkProvider>
    </html>
  )
}
