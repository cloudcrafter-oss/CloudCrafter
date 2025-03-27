import { problemDetailsSchema } from './problemDetailsSchema'
import { stackDetailDtoSchema } from './stackDetailDtoSchema'
import { z } from 'zod'

export const getStackDetailPathParamsSchema = z.object({
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const getStackDetail200Schema = z.lazy(() => stackDetailDtoSchema)

/**
 * @description Not Found
 */
export const getStackDetail404Schema = z.lazy(() => problemDetailsSchema)

export const getStackDetailQueryResponseSchema = z.lazy(() => getStackDetail200Schema)