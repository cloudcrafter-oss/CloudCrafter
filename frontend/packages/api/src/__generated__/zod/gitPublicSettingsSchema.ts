import { z } from 'zod'

export const gitPublicSettingsSchema = z
  .object({
    repository: z.string().nullable().nullish(),
    path: z.string().nullable().nullish(),
    branch: z.string().nullable().nullish(),
  })
  .nullable()