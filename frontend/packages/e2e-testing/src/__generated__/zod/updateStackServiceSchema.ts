import { updateStackServiceCommandSchema } from './updateStackServiceCommandSchema'
import { z } from 'zod'

export const updateStackServicePathParamsSchema = z.object({
  stackId: z.string().uuid(),
  stackServiceId: z.string().uuid(),
})

/**
 * @description OK
 */
export const updateStackService200Schema = z.any()

export const updateStackServiceMutationRequestSchema = z.lazy(() => updateStackServiceCommandSchema)

export const updateStackServiceMutationResponseSchema = z.lazy(() => updateStackService200Schema)