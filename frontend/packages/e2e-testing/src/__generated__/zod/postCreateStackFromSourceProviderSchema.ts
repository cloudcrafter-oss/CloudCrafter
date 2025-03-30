import { createStackFromSourceProviderCommandSchema } from './createStackFromSourceProviderCommandSchema'
import { stackCreatedDtoSchema } from './stackCreatedDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const postCreateStackFromSourceProvider200Schema = z.lazy(() => stackCreatedDtoSchema)

export const postCreateStackFromSourceProviderMutationRequestSchema = z.lazy(() => createStackFromSourceProviderCommandSchema)

export const postCreateStackFromSourceProviderMutationResponseSchema = z.lazy(() => postCreateStackFromSourceProvider200Schema)