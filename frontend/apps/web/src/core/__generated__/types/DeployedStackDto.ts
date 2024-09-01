import type { StackHealthStatus } from "./StackHealthStatus";

 export type DeployedStackDto = {
    /**
     * @type string, uuid
    */
    stackId: string;
    /**
     * @type string
    */
    name: string;
    healthStatus: StackHealthStatus;
};