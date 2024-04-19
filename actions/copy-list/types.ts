import type { z } from 'zod'

import type { ActionState } from '@/lib/create-safe-action'

import type { copyListSchema } from './schema'

export type InputType = z.infer<typeof copyListSchema>
export type ReturnType = ActionState<InputType, string>
