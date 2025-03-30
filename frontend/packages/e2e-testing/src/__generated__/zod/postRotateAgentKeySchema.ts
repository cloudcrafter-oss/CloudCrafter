import { z } from 'zod'

export const postRotateAgentKeyPathParamsSchema = z.object({
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const postRotateAgentKey200Schema = z.any()

export const postRotateAgentKeyMutationResponseSchema = z.lazy(() => postRotateAgentKey200Schema)