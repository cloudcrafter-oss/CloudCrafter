import { stackServiceVolumeDtoSchema } from './stackServiceVolumeDtoSchema'
import { z } from 'zod'

export const getStackServiceVolumesPathParamsSchema = z.object({
  stackId: z.string().uuid(),
  stackServiceId: z.string().uuid(),
})

/**
 * @description OK
 */
export const getStackServiceVolumes200Schema = z.array(z.lazy(() => stackServiceVolumeDtoSchema))

export const getStackServiceVolumesQueryResponseSchema = z.lazy(() => getStackServiceVolumes200Schema)