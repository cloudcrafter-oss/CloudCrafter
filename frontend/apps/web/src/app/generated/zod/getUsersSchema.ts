import { z } from 'zod'
import { userDtoSchema } from './userDtoSchema'


export const getUsers200Schema = z.array(z.lazy(() => userDtoSchema))

 export const getUsersQueryResponseSchema = z.array(z.lazy(() => userDtoSchema))