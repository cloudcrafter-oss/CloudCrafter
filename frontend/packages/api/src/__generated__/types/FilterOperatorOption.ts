export const filterOperatorOptionEnum = {
    "Equal": "Equal",
    "NotEqual": "NotEqual",
    "GreaterThan": "GreaterThan",
    "GreaterThanOrEqual": "GreaterThanOrEqual",
    "LessThan": "LessThan",
    "LessThanOrEqual": "LessThanOrEqual",
    "Contains": "Contains"
} as const;

 export type FilterOperatorOptionEnum = (typeof filterOperatorOptionEnum)[keyof typeof filterOperatorOptionEnum];

 export type FilterOperatorOption = FilterOperatorOptionEnum;