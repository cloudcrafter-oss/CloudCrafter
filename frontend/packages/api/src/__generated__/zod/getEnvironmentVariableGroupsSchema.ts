import { stackEnvironmentVariableGroupDtoSchema } from './stackEnvironmentVariableGroupDtoSchema'
import { z } from 'zod'

export const getEnvironmentVariableGroupsPathParamsSchema = z.object({
  stackId: z.string().uuid(),
})

/**
 * @description OK
 */
export const getEnvironmentVariableGroups200Schema = z.array(z.lazy(() => stackEnvironmentVariableGroupDtoSchema))

export const getEnvironmentVariableGroupsQueryResponseSchema = z.lazy(() => getEnvironmentVariableGroups200Schema)