import { roleDtoSchema } from './roleDtoSchema'
import { z } from 'zod'

/**
 * @description OK
 */
export const getUserRoles200Schema = z.array(z.lazy(() => roleDtoSchema))

export const getUserRolesQueryResponseSchema = z.lazy(() => getUserRoles200Schema)