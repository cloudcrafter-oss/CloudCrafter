export const projectHealthStatus = {
    "Healthy": "Healthy",
    "Degraded": "Degraded",
    "Unhealthy": "Unhealthy",
    "Unknown": "Unknown"
} as const;
export type ProjectHealthStatus = (typeof projectHealthStatus)[keyof typeof projectHealthStatus];