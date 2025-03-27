import { updateStackGithubSettingsSchema } from './updateStackGithubSettingsSchema'
import { updateStackGitPublicSettingsSchema } from './updateStackGitPublicSettingsSchema'
import { z } from 'zod'

export const updateStackCommandSchema = z.object({
  stackId: z.string().uuid(),
  name: z.string().nullable().nullish(),
  description: z.string().nullable().nullish(),
  gitPublicSettings: z
    .lazy(() => updateStackGitPublicSettingsSchema)
    .optional()
    .nullable(),
  githubSettings: z
    .lazy(() => updateStackGithubSettingsSchema)
    .optional()
    .nullable(),
})