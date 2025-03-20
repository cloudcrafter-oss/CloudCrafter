import { z } from 'zod'

export const deleteProjectPathParamsSchema = z.object({
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const deleteProject200Schema = z.any()

export const deleteProjectMutationResponseSchema = z.lazy(() => deleteProject200Schema)