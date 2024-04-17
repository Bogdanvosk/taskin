// 'use server'

// import { auth } from '@clerk/nextjs'
// import { revalidatePath } from 'next/cache'

// import { createSafeAction } from '@/lib/create-safe-action'

// // import { db } from '@/lib/db'
// import { updateBoardSchema } from './schema'
// import type { InputType, ReturnType } from './types'

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { userId } = auth()

//   if (!userId) {
//     return {
//       error: 'Unauthorized'
//     }
//   }

//   const { title, id } = data

//   let board
//   // try {
//   //   board = await db.board.update({
//   //     where: {
//   //       id,
//   //       userId
//   //     },
//   //     data: {
//   //       title
//   //     }
//   //   })
//   // } catch (error) {
//   //   return {
//   //     error: 'Failed to update board'
//   //   }
//   // }

//   revalidatePath(`/board/${id}`)

//   return {
//     data: board
//   }
// }

// export const updateBoard = createSafeAction(updateBoardSchema, handler)
