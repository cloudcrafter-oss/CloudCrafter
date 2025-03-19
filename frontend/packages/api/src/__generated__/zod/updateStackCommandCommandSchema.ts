import { githubSettingsSchema } from './githubSettingsSchema'
import { gitPublicSettingsSchema } from './gitPublicSettingsSchema'
import { z } from 'zod'

export const updateStackCommandCommandSchema = z.object({
  stackId: z.string().uuid(),
  name: z.string().nullable().nullish(),
  description: z.string().nullable().nullish(),
  gitPublicSettings: z
    .lazy(() => gitPublicSettingsSchema)
    .optional()
    .nullable(),
  githubSettings: z
    .lazy(() => githubSettingsSchema)
    .optional()
    .nullable(),
})