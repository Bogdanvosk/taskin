import { z } from 'zod'

export const deleteBoardSchema = z.object({
  id: z.string({
    required_error: 'Board ID is required'
  })
})
