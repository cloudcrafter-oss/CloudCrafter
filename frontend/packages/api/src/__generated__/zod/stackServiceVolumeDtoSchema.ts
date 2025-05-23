import { stackServiceVolumeTypeDtoSchema } from './stackServiceVolumeTypeDtoSchema'
import { z } from 'zod'

export const stackServiceVolumeDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  sourcePath: z.string().nullable(),
  destinationPath: z.string(),
  type: z.lazy(() => stackServiceVolumeTypeDtoSchema),
})