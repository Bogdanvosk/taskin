import { createContext } from 'react'
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'

type RefetchFunction = (
  options?: RefetchOptions
) => Promise<QueryObserverResult<any, Error>>

const RefetchContext = createContext<RefetchFunction | undefined>(undefined)

export default RefetchContext
