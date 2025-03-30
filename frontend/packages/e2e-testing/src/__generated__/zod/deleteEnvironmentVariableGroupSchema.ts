import { z } from 'zod'

export const deleteEnvironmentVariableGroupPathParamsSchema = z.object({
  stackId: z.string().uuid(),
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const deleteEnvironmentVariableGroup200Schema = z.any()

export const deleteEnvironmentVariableGroupMutationResponseSchema = z.lazy(() => deleteEnvironmentVariableGroup200Schema)