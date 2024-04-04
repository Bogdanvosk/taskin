import type { List } from '@prisma/client'
import type { z } from 'zod'

import type { ActionState } from '@/lib/create-safe-action'

import type { updateListSchema } from './schema'

export type InputType = z.infer<typeof updateListSchema>
export type ReturnType = ActionState<InputType, List>
