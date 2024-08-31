import { z } from 'zod'
import { testCommandQuerySchema } from './testCommandQuerySchema'

/**
 * @description OK
 */
export const getTest200Schema = z.any()

export const getTestMutationRequestSchema = z.lazy(() => testCommandQuerySchema)

export const getTestMutationResponseSchema = z.any()
