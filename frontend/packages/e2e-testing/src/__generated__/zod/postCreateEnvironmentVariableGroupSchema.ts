import { createStackEnvironmentVariableGroupCommandSchema } from './createStackEnvironmentVariableGroupCommandSchema'
import { z } from 'zod'

export const postCreateEnvironmentVariableGroupPathParamsSchema = z.object({
  stackId: z.string().uuid(),
})

/**
 * @description Created
 */
export const postCreateEnvironmentVariableGroup201Schema = z.any()

export const postCreateEnvironmentVariableGroupMutationRequestSchema = z.lazy(() => createStackEnvironmentVariableGroupCommandSchema)

export const postCreateEnvironmentVariableGroupMutationResponseSchema = z.lazy(() => postCreateEnvironmentVariableGroup201Schema)