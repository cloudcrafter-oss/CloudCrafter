import { deployedApplicationDtoSchema } from './deployedApplicationDtoSchema'
import { z } from 'zod'


export const projectEnvironmentEnhancedDtoSchema = z.object({ 'environmentCreatedAt': z.string().datetime(), 'deployedApplicationsCount': z.number(), 'lastDeploymentAt': z.string().datetime().nullable().nullish(), 'environmentName': z.string(), 'projectName': z.string(), 'deployedApplications': z.array(z.lazy(() => deployedApplicationDtoSchema)) })