import { z } from 'zod'

export const deleteStackServiceVolumePathParamsSchema = z.object({
  stackId: z.string().uuid(),
  stackServiceId: z.string().uuid(),
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const deleteStackServiceVolume200Schema = z.any()

export const deleteStackServiceVolumeMutationResponseSchema = z.lazy(() => deleteStackServiceVolume200Schema)