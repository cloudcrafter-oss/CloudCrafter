import { z } from 'zod'

export const createStackFromSourceProviderCommandCommandSchema = z.object({
  name: z.string().min(3),
  providerId: z.string().uuid(),
  repositoryId: z.string().min(1),
  branch: z.string().min(1),
  path: z.string(),
  environmentId: z.string().uuid(),
  serverId: z.string().uuid(),
  repository: z.string(),
})