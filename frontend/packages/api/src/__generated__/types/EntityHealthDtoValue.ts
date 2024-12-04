export const entityHealthDtoValueEnum = {
    "Unknown": "Unknown",
    "Unsupported": "Unsupported",
    "Degraded": "Degraded",
    "Unhealthy": "Unhealthy",
    "Healthy": "Healthy",
    "HeathCheckOverdue": "HeathCheckOverdue"
} as const;

 export type EntityHealthDtoValueEnum = (typeof entityHealthDtoValueEnum)[keyof typeof entityHealthDtoValueEnum];

 export type EntityHealthDtoValue = EntityHealthDtoValueEnum;