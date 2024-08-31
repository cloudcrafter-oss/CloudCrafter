export const applicationHealthStatus = {
    '0': 0,
    '1': 1,
    '2': 2
} as const
export type ApplicationHealthStatus = (typeof applicationHealthStatus)[keyof typeof applicationHealthStatus];