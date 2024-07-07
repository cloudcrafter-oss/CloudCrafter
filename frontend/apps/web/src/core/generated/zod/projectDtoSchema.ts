import { z } from 'zod'


export const projectDtoSchema = z.object({ 'id': z.string().uuid(), 'name': z.string() })