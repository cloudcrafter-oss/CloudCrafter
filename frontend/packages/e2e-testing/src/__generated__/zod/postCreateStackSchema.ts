import { createStackCommandSchema } from './createStackCommandSchema'
import { stackCreatedDtoSchema } from './stackCreatedDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const postCreateStack200Schema = z.lazy(() => stackCreatedDtoSchema)

export const postCreateStackMutationRequestSchema = z.lazy(() => createStackCommandSchema)

export const postCreateStackMutationResponseSchema = z.lazy(() => postCreateStack200Schema)