import { applicationHealthStatusSchema } from './applicationHealthStatusSchema'
import { z } from 'zod'


export const deployedApplicationDtoSchema = z.object({ 'applicationId': z.string().uuid(), 'name': z.string(), 'healthStatus': z.lazy(() => applicationHealthStatusSchema) })