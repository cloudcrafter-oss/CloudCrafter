import { z } from 'zod'

export const getExportEnvironmentVariablesPathParamsSchema = z.object({
  stackId: z.string().uuid(),
})

export const getExportEnvironmentVariablesQueryParamsSchema = z
  .object({
    includeSecrets: z.boolean().default(false),
  })
  .optional()

/**
 * @description OK
 */
export const getExportEnvironmentVariables200Schema = z.any()

export const getExportEnvironmentVariablesQueryResponseSchema = z.lazy(() => getExportEnvironmentVariables200Schema)