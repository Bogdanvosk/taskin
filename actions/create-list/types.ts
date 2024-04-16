import type { z } from 'zod'

import type { ActionState } from '@/lib/create-safe-action'

import type { createListSchema } from './schema'
// import { List } from '@/types';

export type InputType = z.infer<typeof createListSchema>
export type ReturnType = ActionState<InputType, string>
