import { z } from 'zod'

export const githubApplicationSourceDtoSchema = z
  .object({
    repositoryId: z.string(),
    branch: z.string(),
    repository: z.string(),
    path: z.string(),
  })
  .nullable()