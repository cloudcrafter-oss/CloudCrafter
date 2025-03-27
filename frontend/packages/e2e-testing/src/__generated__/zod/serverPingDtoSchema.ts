import { serverStatusDtoValueSchema } from './serverStatusDtoValueSchema'
import { z } from 'zod'

export const serverPingDtoSchema = z.object({
  lastPingReceivedAt: z.string().datetime().nullable().nullish(),
  osInfo: z.string().nullable().nullish(),
  dockerVersion: z.string().nullable().nullish(),
  cpuUsagePercentage: z.number().nullable().nullish(),
  totalCpuCount: z.number().int().nullable().nullish(),
  memoryUsagePercentage: z.number().nullable().nullish(),
  totalMemoryBytes: z.number().int().nullable().nullish(),
  status: z.lazy(() => serverStatusDtoValueSchema),
})