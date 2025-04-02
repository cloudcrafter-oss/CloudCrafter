import { stackServiceVolumeTypeDtoSchema } from './stackServiceVolumeTypeDtoSchema'
import { z } from 'zod'

export const createStackServiceVolumeCommandSchema = z.object({
  stackId: z.string().uuid(),
  stackServiceId: z.string().uuid(),
  name: z.string().min(1),
  type: z.lazy(() => stackServiceVolumeTypeDtoSchema),
  source: z.string().nullable(),
  target: z.string().min(1),
})