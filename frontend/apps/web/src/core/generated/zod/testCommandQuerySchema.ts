import { z } from 'zod'

export const testCommandQuerySchema = z.object({ fail: z.boolean() })
