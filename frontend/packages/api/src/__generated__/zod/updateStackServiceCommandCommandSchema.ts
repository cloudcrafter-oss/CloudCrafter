import { z } from 'zod'

export const updateStackServiceCommandCommandSchema = z.object({
  stackId: z.string().uuid(),
  stackServiceId: z.string().uuid(),
  name: z.string().nullable().nullish(),
  domainName: z.string().nullable().nullish(),
  containerPortExposes: z.number().int().nullable().nullish(),
  containerHealthCheckPort: z.number().int().nullable().nullish(),
})