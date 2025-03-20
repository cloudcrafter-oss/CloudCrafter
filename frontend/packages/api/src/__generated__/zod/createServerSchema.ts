import { createdServerDtoSchema } from './createdServerDtoSchema'
import { createServerCommandCommandSchema } from './createServerCommandCommandSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const createServer200Schema = z.lazy(() => createdServerDtoSchema)

export const createServerMutationRequestSchema = z.lazy(() => createServerCommandCommandSchema)

export const createServerMutationResponseSchema = z.lazy(() => createServer200Schema)