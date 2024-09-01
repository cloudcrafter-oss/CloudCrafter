export const stackHealthStatus = {
    "Healthy": "Healthy",
    "Degraded": "Degraded",
    "Unhealthy": "Unhealthy"
} as const;
export type StackHealthStatus = (typeof stackHealthStatus)[keyof typeof stackHealthStatus];