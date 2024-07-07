import { z } from 'zod'
import { projectDtoSchema } from './projectDtoSchema'

 /**
 * @description OK
 */
export const getProjects200Schema = z.array(z.lazy(() => projectDtoSchema))
/**
 * @description OK
 */
export const getProjectsQueryResponseSchema = z.array(z.lazy(() => projectDtoSchema))