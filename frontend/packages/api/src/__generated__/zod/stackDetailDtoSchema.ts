import { entityHealthDtoSchema } from './entityHealthDtoSchema'
import { stackServerDtoSchema } from './stackServerDtoSchema'
import { stackServiceDtoSchema } from './stackServiceDtoSchema'
import { stackSourceDtoSchema } from './stackSourceDtoSchema'
import { z } from 'zod'

export const stackDetailDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  services: z.array(z.lazy(() => stackServiceDtoSchema)),
  source: z.lazy(() => stackSourceDtoSchema).nullable(),
  destination: z.lazy(() => stackServerDtoSchema),
  health: z.lazy(() => entityHealthDtoSchema),
})