export const stackHealthStatus = {
    "Healthy": "Healthy",
    "Degraded": "Degraded",
    "Unhealthy": "Unhealthy",
    "Unknown": "Unknown"
} as const;
export type StackHealthStatus = (typeof stackHealthStatus)[keyof typeof stackHealthStatus];