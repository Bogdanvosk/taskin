// 'use server'

// import { auth } from '@clerk/nextjs'
// import { revalidatePath } from 'next/cache'

// import { createSafeAction } from '@/lib/create-safe-action'

// // import { db } from '@/lib/db'
// import { deleteListSchema } from './schema'
// import type { InputType, ReturnType } from './types'

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { userId } = auth()

//   if (!userId) {
//     return {
//       error: 'Unauthorized'
//     }
//   }

//   const { id, boardId } = data
//   let list
//   // try {
//   //   list = await db.list.delete({
//   //     where: {
//   //       id,
//   //       boardId,
//   //       board: {
//   //         userId
//   //       }
//   //     }
//   //   })
//   // } catch (error) {
//   //   return {
//   //     error: 'Failed to delete list'
//   //   }
//   // }

//   revalidatePath(`/board/${boardId}`)
//   return { data: list }
// }

// export const deleteList = createSafeAction(deleteListSchema, handler)
