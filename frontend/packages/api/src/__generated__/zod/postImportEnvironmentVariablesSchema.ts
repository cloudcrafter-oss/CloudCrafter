import { problemDetailsSchema } from './problemDetailsSchema'
import { z } from 'zod'

export const postImportEnvironmentVariablesPathParamsSchema = z.object({
  stackId: z.string().uuid(),
})

/**
 * @description OK
 */
export const postImportEnvironmentVariables200Schema = z.any()

/**
 * @description Bad Request
 */
export const postImportEnvironmentVariables400Schema = z.lazy(() => problemDetailsSchema)

export const postImportEnvironmentVariablesMutationResponseSchema = z.lazy(() => postImportEnvironmentVariables200Schema)