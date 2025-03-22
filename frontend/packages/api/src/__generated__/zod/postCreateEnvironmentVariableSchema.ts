import { createStackEnvironmentVariableCommandSchema } from './createStackEnvironmentVariableCommandSchema'
import { problemDetailsSchema } from './problemDetailsSchema'
import { z } from 'zod'

export const postCreateEnvironmentVariablePathParamsSchema = z.object({
  stackId: z.string().uuid(),
})

/**
 * @description Created
 */
export const postCreateEnvironmentVariable201Schema = z.any()

/**
 * @description Bad Request
 */
export const postCreateEnvironmentVariable400Schema = z.lazy(() => problemDetailsSchema)

export const postCreateEnvironmentVariableMutationRequestSchema = z.lazy(() => createStackEnvironmentVariableCommandSchema)

export const postCreateEnvironmentVariableMutationResponseSchema = z.lazy(() => postCreateEnvironmentVariable201Schema)