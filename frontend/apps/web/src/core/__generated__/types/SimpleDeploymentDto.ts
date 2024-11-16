import type { DeploymentStatusDto } from "./DeploymentStatusDto.ts";

 export type SimpleDeploymentDto = {
    /**
     * @type string, date-time
    */
    createdAt: string;
    /**
     * @type string, date-time
    */
    updatedAt: string;
    /**
     * @type string, uuid
    */
    id: string;
    state: DeploymentStatusDto;
};