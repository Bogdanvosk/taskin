import { z } from 'zod'

export const changeFavouriteSchema = z.object({
  id: z.string(),
  isFavourite: z.boolean()
})
