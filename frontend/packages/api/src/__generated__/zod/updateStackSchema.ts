import { problemDetailsSchema } from './problemDetailsSchema'
import { stackDetailDtoSchema } from './stackDetailDtoSchema'
import { updateStackCommandSchema } from './updateStackCommandSchema'
import { z } from 'zod'

export const updateStackPathParamsSchema = z.object({
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const updateStack200Schema = z.lazy(() => stackDetailDtoSchema)

/**
 * @description Not Found
 */
export const updateStack404Schema = z.lazy(() => problemDetailsSchema)

export const updateStackMutationRequestSchema = z.lazy(() => updateStackCommandSchema)

export const updateStackMutationResponseSchema = z.lazy(() => updateStack200Schema)