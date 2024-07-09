import * as z from 'zod'

const FilterParamSchema = z.string().regex(/^[^~]+~(eq|ne|gt|ge|lt|le|contains)~.*$/)

// Define the schema for the filter array
export const filterFilterSchema = z.array(FilterParamSchema).nonempty().optional()

export const searchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    title: z.string().optional(),
    status: z.string().optional(),
    priority: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    operator: z.enum(['and', 'or']).optional(),
    'filter[]': filterFilterSchema,
}).transform(data => ({
    ...data,
    filter: data['filter[]'] ? data['filter[]'].map(filter => {
        const [propertyName, operator, value] = filter.split('~')

        return { propertyName, operator, value }
    }) : undefined
}))

