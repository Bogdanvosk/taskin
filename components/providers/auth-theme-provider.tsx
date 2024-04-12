'use client'

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useDarkMode } from 'usehooks-ts'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthThemeProvider = ({ children }: AuthProviderProps) => {
  const { isDarkMode } = useDarkMode()

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDarkMode ? dark : undefined
      }}
    >
      {children}
    </ClerkProvider>
  )
}
