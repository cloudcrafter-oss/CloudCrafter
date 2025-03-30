import { providerTypeSchema } from './providerTypeSchema'
import { simpleGithubProviderDtoSchema } from './simpleGithubProviderDtoSchema'
import { z } from 'zod'

export const sourceProviderDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  github: z
    .lazy(() => simpleGithubProviderDtoSchema)
    .optional()
    .nullable(),
  type: z.lazy(() => providerTypeSchema),
})