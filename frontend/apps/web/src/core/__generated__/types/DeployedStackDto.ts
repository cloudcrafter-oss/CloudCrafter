import type { ProjectHealthStatus } from "./ProjectHealthStatus";

 export type DeployedStackDto = {
    /**
     * @type string, uuid
    */
    stackId: string;
    /**
     * @type string
    */
    name: string;
    /**
     * @type string
    */
    healthStatus: ProjectHealthStatus;
};