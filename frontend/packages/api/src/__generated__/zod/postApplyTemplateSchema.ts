import { problemDetailsSchema } from './problemDetailsSchema'
import { z } from 'zod'

export const postApplyTemplatePathParamsSchema = z.object({
  stackId: z.string().uuid(),
  templateId: z.string().uuid(),
})

export const postApplyTemplateQueryParamsSchema = z
  .object({
    overrideExisting: z.boolean().default(false),
  })
  .optional()

/**
 * @description OK
 */
export const postApplyTemplate200Schema = z.any()

/**
 * @description Bad Request
 */
export const postApplyTemplate400Schema = z.lazy(() => problemDetailsSchema)

export const postApplyTemplateMutationResponseSchema = z.lazy(() => postApplyTemplate200Schema)