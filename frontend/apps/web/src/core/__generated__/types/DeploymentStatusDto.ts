export const deploymentStatusDto = {
    "Created": "Created",
    "Running": "Running",
    "Failed": "Failed",
    "Succeeded": "Succeeded"
} as const;
export type DeploymentStatusDto = (typeof deploymentStatusDto)[keyof typeof deploymentStatusDto];