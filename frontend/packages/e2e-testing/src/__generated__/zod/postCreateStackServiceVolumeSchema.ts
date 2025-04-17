import { createStackServiceVolumeCommandSchema } from './createStackServiceVolumeCommandSchema'
import { z } from 'zod'

export const postCreateStackServiceVolumePathParamsSchema = z.object({
  stackId: z.string().uuid(),
  stackServiceId: z.string().uuid(),
})

/**
 * @description Created
 */
export const postCreateStackServiceVolume201Schema = z.any()

export const postCreateStackServiceVolumeMutationRequestSchema = z.lazy(() => createStackServiceVolumeCommandSchema)

export const postCreateStackServiceVolumeMutationResponseSchema = z.lazy(() => postCreateStackServiceVolume201Schema)