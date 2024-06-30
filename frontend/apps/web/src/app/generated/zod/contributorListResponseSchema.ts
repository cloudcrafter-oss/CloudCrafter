import { contributorRecordSchema } from './contributorRecordSchema'
import { z } from 'zod'


export const contributorListResponseSchema = z.object({ 'contributors': z.array(z.lazy(() => contributorRecordSchema)).optional() })