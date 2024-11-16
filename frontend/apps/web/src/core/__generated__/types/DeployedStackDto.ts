import type { EntityHealthDto } from "./EntityHealthDto.ts";

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
     * @type object
    */
    health: EntityHealthDto;
};