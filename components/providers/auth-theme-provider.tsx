'use client'

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useDarkMode } from 'usehooks-ts'

import { ruRU } from "@clerk/localizations";

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthThemeProvider = ({ children }: AuthProviderProps) => {
  const { isDarkMode } = useDarkMode()

  return (
    <ClerkProvider
    localization={ruRU}
      appearance={{
        baseTheme: isDarkMode ? dark : undefined
      }}
    >
      {children}
    </ClerkProvider>
  )
}
