import type { Card } from '@prisma/client'
import type { z } from 'zod'

import type { ActionState } from '@/lib/create-safe-action'

import type { updateCardSchema } from './schema'

export type InputType = z.infer<typeof updateCardSchema>
export type ReturnType = ActionState<InputType, Card>
