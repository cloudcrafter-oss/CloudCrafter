import { z } from 'zod'


export const filterOperatorOptionSchema = z.enum(['Equal', 'NotEqual', 'GreaterThan', 'GreaterThanOrEqual', 'LessThan', 'LessThanOrEqual', 'Contains'])