import { z } from 'zod'

export const copyBoardSchema = z.object({
  id: z.string({
    required_error: 'Board ID is required'
  })
})
