import { problemDetailsSchema } from './problemDetailsSchema'
import { updateStackServiceVolumeCommandSchema } from './updateStackServiceVolumeCommandSchema'
import { z } from 'zod'

export const putUpdateStackServiceVolumePathParamsSchema = z.object({
  stackId: z.string().uuid(),
  stackServiceId: z.string().uuid(),
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const putUpdateStackServiceVolume200Schema = z.any()

/**
 * @description Bad Request
 */
export const putUpdateStackServiceVolume400Schema = z.lazy(() => problemDetailsSchema)

export const putUpdateStackServiceVolumeMutationRequestSchema = z.lazy(() => updateStackServiceVolumeCommandSchema)

export const putUpdateStackServiceVolumeMutationResponseSchema = z.lazy(() => putUpdateStackServiceVolume200Schema)