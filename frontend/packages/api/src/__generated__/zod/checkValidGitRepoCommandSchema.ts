import { z } from 'zod'

export const checkValidGitRepoCommandSchema = z.object({
  repository: z.string(),
})