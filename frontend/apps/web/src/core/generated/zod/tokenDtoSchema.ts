import { z } from 'zod'


export const tokenDtoSchema = z.object({ 'token': z.string(), 'validTo': z.string().datetime() })