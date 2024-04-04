import { z } from 'zod'

export const createCardSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title is required'
  }),
  listId: z.string(),
  boardId: z.string()
})
