export const serverStatusDtoValueEnum = {
    "Unknown": "Unknown",
    "Connected": "Connected",
    "Disconnected": "Disconnected"
} as const;

 export type ServerStatusDtoValueEnum = (typeof serverStatusDtoValueEnum)[keyof typeof serverStatusDtoValueEnum];

 export type ServerStatusDtoValue = ServerStatusDtoValueEnum;