import { z } from 'zod'
import { serverDtoSchema } from './serverDtoSchema'

/**
 * @description OK
 */
export const getServers200Schema = z.array(z.lazy(() => serverDtoSchema))
/**
 * @description OK
 */
export const getServersQueryResponseSchema = z.array(
	z.lazy(() => serverDtoSchema),
)
