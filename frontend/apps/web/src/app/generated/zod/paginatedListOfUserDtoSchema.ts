import { userDtoSchema } from './userDtoSchema'
import { z } from 'zod'


export const paginatedListOfUserDtoSchema = z.object({ 'currentPage': z.number().optional(), 'totalPages': z.number().optional(), 'totalItems': z.number().optional(), 'result': z.array(z.lazy(() => userDtoSchema)).optional() })