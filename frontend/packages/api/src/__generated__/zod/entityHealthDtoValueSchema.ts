import { z } from 'zod'

export const entityHealthDtoValueSchema = z.enum(['Unknown', 'Unsupported', 'Degraded', 'Unhealthy', 'Healthy', 'HeathCheckOverdue'])