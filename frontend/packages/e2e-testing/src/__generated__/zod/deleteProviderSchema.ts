import { z } from 'zod'

export const deleteProviderPathParamsSchema = z.object({
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const deleteProvider200Schema = z.any()

export const deleteProviderMutationResponseSchema = z.lazy(() => deleteProvider200Schema)