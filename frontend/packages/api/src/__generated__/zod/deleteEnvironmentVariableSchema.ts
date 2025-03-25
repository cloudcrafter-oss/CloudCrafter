import { z } from 'zod'

export const deleteEnvironmentVariablePathParamsSchema = z.object({
  stackId: z.string().uuid(),
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const deleteEnvironmentVariable200Schema = z.any()

export const deleteEnvironmentVariableMutationResponseSchema = z.lazy(() => deleteEnvironmentVariable200Schema)