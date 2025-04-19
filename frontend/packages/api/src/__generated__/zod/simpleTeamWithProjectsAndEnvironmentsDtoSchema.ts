import { projectDtoSchema } from './projectDtoSchema'
import { z } from 'zod'

export const simpleTeamWithProjectsAndEnvironmentsDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  projects: z.array(z.lazy(() => projectDtoSchema)),
})