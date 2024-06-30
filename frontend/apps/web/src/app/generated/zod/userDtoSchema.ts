import { z } from 'zod'


export const userDtoSchema = z.object({ 'id': z.string().optional(), 'email': z.string().optional(), 'createdAt': z.string().datetime().optional() })