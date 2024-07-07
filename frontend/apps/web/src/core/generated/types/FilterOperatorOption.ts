export const filterOperatorOption = {
    'Equal': 'Equal',
    'NotEqual': 'NotEqual',
    'GreaterThan': 'GreaterThan',
    'GreaterThanOrEqual': 'GreaterThanOrEqual',
    'LessThan': 'LessThan',
    'LessThanOrEqual': 'LessThanOrEqual',
    'Contains': 'Contains'
} as const
export type FilterOperatorOption = (typeof filterOperatorOption)[keyof typeof filterOperatorOption];