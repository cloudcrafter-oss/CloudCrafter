import type { StackServiceDto } from "./StackServiceDto";
import type { StackSourceDto } from "./StackSourceDto";
import type { StackServerDto } from "./StackServerDto";
import type { EntityHealthDto } from "./EntityHealthDto";

 export type StackDetailDto = {
    /**
     * @type string, uuid
    */
    id: string;
    /**
     * @type string
    */
    name: string;
    /**
     * @type array
    */
    services: StackServiceDto[];
    /**
     * @type object
    */
    source: StackSourceDto;
    /**
     * @type object
    */
    destination: StackServerDto;
    /**
     * @type object
    */
    health: EntityHealthDto;
};