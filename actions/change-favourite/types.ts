import type { z } from 'zod'

import type { ActionState } from '@/lib/create-safe-action'

import type { changeFavouriteSchema } from './schema'

export type InputType = z.infer<typeof changeFavouriteSchema>
export type ReturnType = ActionState<InputType, string>
