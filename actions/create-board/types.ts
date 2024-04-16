// import type { Board } from '@prisma/client'
import type { z } from 'zod'

import type { ActionState } from '@/lib/create-safe-action'

import type { createBoardSchema } from './schema'

export type InputType = z.infer<typeof createBoardSchema>
export type ReturnType = ActionState<InputType, any>
