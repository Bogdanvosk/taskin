import { z } from 'zod'

export const copyListSchema = z.object({
  id: z.string({
    required_error: 'List ID is required'
  }),
  boardId: z.string()
})
