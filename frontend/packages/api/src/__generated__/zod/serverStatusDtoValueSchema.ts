import { z } from 'zod'

export const serverStatusDtoValueSchema = z.enum(['Unknown', 'Connected', 'Disconnected'])