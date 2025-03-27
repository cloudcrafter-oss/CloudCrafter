import { z } from 'zod'

export const gitApplicationSourceDtoSchema = z
  .object({
    repository: z.string(),
    path: z.string().nullable().nullish(),
    branch: z.string().nullable().nullish(),
  })
  .nullable()