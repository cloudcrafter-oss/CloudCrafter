import { createdServerDtoSchema } from './createdServerDtoSchema'
import { createServerCommandSchema } from './createServerCommandSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const createServer200Schema = z.lazy(() => createdServerDtoSchema)

export const createServerMutationRequestSchema = z.lazy(() => createServerCommandSchema)

export const createServerMutationResponseSchema = z.lazy(() => createServer200Schema)