import type { Board } from '@prisma/client'
import type { z } from 'zod'

import type { ActionState } from '@/lib/create-safe-action'

import type { updateBoardSchema } from './schema'

export type InputType = z.infer<typeof updateBoardSchema>
export type ReturnType = ActionState<InputType, Board>
