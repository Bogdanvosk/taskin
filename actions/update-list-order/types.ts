// import type { List } from '@prisma/client'
import type { z } from 'zod'

import type { ActionState } from '@/lib/create-safe-action'

import type { updateListOrderSchema } from './schema'

export type InputType = z.infer<typeof updateListOrderSchema>
export type ReturnType = ActionState<InputType, string>
