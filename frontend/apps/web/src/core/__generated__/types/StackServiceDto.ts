import type { StackHealthStatus } from "./StackHealthStatus";

 export type StackServiceDto = {
    /**
     * @type string, uuid
    */
    id: string;
    /**
     * @type string
    */
    name: string;
    healthStatus: StackHealthStatus;
};