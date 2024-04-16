// import type { Card } from '@prisma/client'
import type { z } from 'zod'

import type { ActionState } from '@/lib/create-safe-action'

import type { createCardSchema } from './schema'

export type InputType = z.infer<typeof createCardSchema>
export type ReturnType = ActionState<InputType, string>
