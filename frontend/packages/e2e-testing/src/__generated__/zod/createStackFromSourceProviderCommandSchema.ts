import { z } from 'zod'

export const createStackFromSourceProviderCommandSchema = z.object({
  name: z.string().min(3),
  providerId: z.string().uuid(),
  repositoryId: z.string().min(1),
  branch: z.string().min(1),
  path: z.string(),
  repository: z.string(),
  environmentId: z.string().uuid(),
  serverId: z.string().uuid(),
})