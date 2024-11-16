export const deploymentStatusDtoEnum = {
    "Created": "Created",
    "Running": "Running",
    "Failed": "Failed",
    "Succeeded": "Succeeded"
} as const;

 export type DeploymentStatusDtoEnum = (typeof deploymentStatusDtoEnum)[keyof typeof deploymentStatusDtoEnum];

 export type DeploymentStatusDto = DeploymentStatusDtoEnum;