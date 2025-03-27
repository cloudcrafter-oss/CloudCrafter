import { simpleDeploymentDtoSchema } from './simpleDeploymentDtoSchema'
import { z } from 'zod'

export const paginatedListOfSimpleDeploymentDtoSchema = z.object({
  page: z.number().int(),
  totalPages: z.number().int(),
  totalItems: z.number().int(),
  result: z.array(z.lazy(() => simpleDeploymentDtoSchema)),
})