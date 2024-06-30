import { z } from 'zod'


export const userDtoSchema = z.object({ 'email': z.string().optional() })