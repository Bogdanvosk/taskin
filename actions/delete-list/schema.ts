import { z } from 'zod'

export const deleteListSchema = z.object({
  id: z.string({
    required_error: 'List ID is required'
  }),
  boardId: z.string()
})
