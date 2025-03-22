import { stackEnvironmentVariableDtoSchema } from './stackEnvironmentVariableDtoSchema'
import { z } from 'zod'

export const getEnvironmentVariablesPathParamsSchema = z.object({
  stackId: z.string().uuid(),
})

export const getEnvironmentVariablesQueryParamsSchema = z
  .object({
    includeInherited: z.boolean().default(false),
    includeSecrets: z.boolean().default(false),
  })
  .optional()

/**
 * @description OK
 */
export const getEnvironmentVariables200Schema = z.array(z.lazy(() => stackEnvironmentVariableDtoSchema))

export const getEnvironmentVariablesQueryResponseSchema = z.lazy(() => getEnvironmentVariables200Schema)