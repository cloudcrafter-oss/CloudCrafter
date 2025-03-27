import { createStackEnvironmentVariableCommandSchema } from './createStackEnvironmentVariableCommandSchema'
import { z } from 'zod'

export const postCreateEnvironmentVariablePathParamsSchema = z.object({
  stackId: z.string().uuid(),
})

/**
 * @description Created
 */
export const postCreateEnvironmentVariable201Schema = z.any()

export const postCreateEnvironmentVariableMutationRequestSchema = z.lazy(() => createStackEnvironmentVariableCommandSchema)

export const postCreateEnvironmentVariableMutationResponseSchema = z.lazy(() => postCreateEnvironmentVariable201Schema)