import { sortDirectionSchema } from './sortDirectionSchema'
import { z } from 'zod'


export const sortModelSchema = z.object({ 'field': z.string(), 'direction': z.lazy(() => sortDirectionSchema) })