import { z } from 'zod'


export const projectDtoSchema = z.object({ 'id': z.string().uuid(), 'name': z.string(), 'description': z.string().nullable().nullish(), 'createdAt': z.string().datetime(), 'updatedAt': z.string().datetime() })