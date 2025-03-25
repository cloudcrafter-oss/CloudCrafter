import { problemDetailsSchema } from './problemDetailsSchema'
import { updateStackEnvironmentVariableGroupCommandSchema } from './updateStackEnvironmentVariableGroupCommandSchema'
import { z } from 'zod'

export const putUpdateEnvironmentVariableGroupPathParamsSchema = z.object({
  stackId: z.string().uuid(),
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const putUpdateEnvironmentVariableGroup200Schema = z.any()

/**
 * @description Bad Request
 */
export const putUpdateEnvironmentVariableGroup400Schema = z.lazy(() => problemDetailsSchema)

export const putUpdateEnvironmentVariableGroupMutationRequestSchema = z.lazy(() => updateStackEnvironmentVariableGroupCommandSchema)

export const putUpdateEnvironmentVariableGroupMutationResponseSchema = z.lazy(() => putUpdateEnvironmentVariableGroup200Schema)