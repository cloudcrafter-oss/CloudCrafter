import { z } from 'zod'

export const githubSettingsSchema = z
  .object({
    branch: z.string().nullable().nullish(),
    path: z.string().nullable().nullish(),
  })
  .nullable()