export const sortDirection = {
    '0': 0,
    '1': 1
} as const
export type SortDirection = (typeof sortDirection)[keyof typeof sortDirection];