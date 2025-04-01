import { stackServiceVolumeTypeSchema } from './stackServiceVolumeTypeSchema'
import { z } from 'zod'

export const createStackServiceVolumeCommandSchema = z.object({
  stackId: z.string().uuid(),
  stackServiceId: z.string().uuid(),
  name: z.string(),
  type: z.lazy(() => stackServiceVolumeTypeSchema),
  source: z.string().nullable(),
  target: z.string(),
})