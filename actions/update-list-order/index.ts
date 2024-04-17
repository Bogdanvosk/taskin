// 'use server'

// import { auth } from '@clerk/nextjs'
// import { revalidatePath } from 'next/cache'

// import { createSafeAction } from '@/lib/create-safe-action'

// // import { db } from '@/lib/db'
// import { updateListOrderSchema } from './schema'
// import type { InputType, ReturnType } from './types'

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { userId } = auth()

//   if (!userId) {
//     return {
//       error: 'Unauthorized'
//     }
//   }

//   const { boardId } = data

//   let lists
//   // try {
//   //   const transaction = items.map((list) => {
//   //     return db.list.update({
//   //       where: {
//   //         id: list.id,
//   //         board: {
//   //           userId
//   //         }
//   //       },
//   //       data: {
//   //         order: list.order
//   //       }
//   //     })
//   //   })

//   //   lists = await db.$transaction(transaction)
//   // } catch (err) {
//   //   return {
//   //     error: 'Failed to reorder lists'
//   //   }
//   // }

//   revalidatePath(`/board/${boardId}`)

//   return {
//     data: lists
//   }
// }

// export const updateListOrder = createSafeAction(updateListOrderSchema, handler)
