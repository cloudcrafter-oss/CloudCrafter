import { z } from 'zod'

export const stackServiceHttpConfigurationDtoSchema = z
  .object({
    domainName: z.string().nullable(),
    containerHttpPort: z.number().int().nullable(),
  })
  .nullable()