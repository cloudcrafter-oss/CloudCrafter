import type { EntityHealthDto } from "./EntityHealthDto.ts";

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
     * @type string
    */
    description: string | null;
    /**
     * @type object
    */
    health: EntityHealthDto;
};