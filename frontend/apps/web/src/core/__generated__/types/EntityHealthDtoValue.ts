export const entityHealthDtoValue = {
    "Unknown": "Unknown",
    "Unsupported": "Unsupported",
    "Degraded": "Degraded",
    "Unhealthy": "Unhealthy",
    "Healthy": "Healthy"
} as const;
export type EntityHealthDtoValue = (typeof entityHealthDtoValue)[keyof typeof entityHealthDtoValue];