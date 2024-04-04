import type { List } from '@prisma/client'
import type { z } from 'zod'

import type { ActionState } from '@/lib/create-safe-action'

import type { createListSchema } from './schema'

export type InputType = z.infer<typeof createListSchema>
export type ReturnType = ActionState<InputType, List>
