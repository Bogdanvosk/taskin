'use client'

import type { MessageFormatElement } from 'react-intl'
import { IntlProvider } from 'react-intl'

interface ServerIntlProviderProps {
  messages:
    | Record<string, string>
    | Record<string, MessageFormatElement[]>
    | undefined
  locale: string
  children: React.ReactNode
}

const ServerIntlProvider = ({
  messages,
  locale,
  children
}: ServerIntlProviderProps) => {
  return (
    <IntlProvider messages={messages} locale={locale}>
      {children}
    </IntlProvider>
  )
}

export default ServerIntlProvider
