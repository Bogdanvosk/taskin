import { z } from 'zod'

export const createListSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title is required'
    })
    .min(1, {
      message: 'Title is required'
    }),
  boardId: z.string()
})
