import type { z } from 'zod'

import type { ActionState } from '@/lib/create-safe-action'

import type { copyBoardSchema } from './schema'

export type InputType = z.infer<typeof copyBoardSchema>
export type ReturnType = ActionState<InputType, string>
