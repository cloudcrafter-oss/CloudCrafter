import { z } from 'zod'

export const updateStackGithubSettingsSchema = z
  .object({
    branch: z.string().nullable().nullish(),
    path: z.string().nullable().nullish(),
  })
  .nullable()