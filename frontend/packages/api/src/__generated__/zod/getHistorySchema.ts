import { stackEnvironmentVariableHistoryDtoSchema } from './stackEnvironmentVariableHistoryDtoSchema'
import { z } from 'zod'

export const getHistoryPathParamsSchema = z.object({
  stackId: z.string().uuid(),
})

export const getHistoryQueryParamsSchema = z
  .object({
    startDate: z.string().datetime().default({}),
    endDate: z.string().datetime().default({}),
  })
  .optional()

/**
 * @description OK
 */
export const getHistory200Schema = z.array(z.lazy(() => stackEnvironmentVariableHistoryDtoSchema))

export const getHistoryQueryResponseSchema = z.lazy(() => getHistory200Schema)