import { problemDetailsSchema } from './problemDetailsSchema'
import { updateStackEnvironmentVariableCommandSchema } from './updateStackEnvironmentVariableCommandSchema'
import { z } from 'zod'

export const putUpdateEnvironmentVariablePathParamsSchema = z.object({
  stackId: z.string().uuid(),
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const putUpdateEnvironmentVariable200Schema = z.any()

/**
 * @description Bad Request
 */
export const putUpdateEnvironmentVariable400Schema = z.lazy(() => problemDetailsSchema)

export const putUpdateEnvironmentVariableMutationRequestSchema = z.lazy(() => updateStackEnvironmentVariableCommandSchema)

export const putUpdateEnvironmentVariableMutationResponseSchema = z.lazy(() => putUpdateEnvironmentVariable200Schema)