import { z } from 'zod'

export const requestSchema = z.object({
  installationId: z.number().int(),
})