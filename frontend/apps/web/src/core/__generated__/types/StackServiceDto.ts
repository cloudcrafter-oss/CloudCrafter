import type { EntityHealthDto } from "./EntityHealthDto";

 export type StackServiceDto = {
    /**
     * @type string, uuid
    */
    id: string;
    /**
     * @type string
    */
    name: string;
    /**
     * @type object
    */
    health: EntityHealthDto;
};