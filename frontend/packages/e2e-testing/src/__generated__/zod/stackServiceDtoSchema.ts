import { entityHealthDtoSchema } from './entityHealthDtoSchema'
import { stackServiceHealthcheckConfigurationDtoSchema } from './stackServiceHealthcheckConfigurationDtoSchema'
import { stackServiceHttpConfigurationDtoSchema } from './stackServiceHttpConfigurationDtoSchema'
import { z } from 'zod'

export const stackServiceDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  httpConfiguration: z.lazy(() => stackServiceHttpConfigurationDtoSchema).nullable(),
  healthcheckConfiguration: z.lazy(() => stackServiceHealthcheckConfigurationDtoSchema),
  health: z.lazy(() => entityHealthDtoSchema),
})