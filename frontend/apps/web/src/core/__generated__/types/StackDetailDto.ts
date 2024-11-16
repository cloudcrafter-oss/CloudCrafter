import type { EntityHealthDto } from "./EntityHealthDto.ts";
import type { StackServerDto } from "./StackServerDto.ts";
import type { StackServiceDto } from "./StackServiceDto.ts";
import type { StackSourceDto } from "./StackSourceDto.ts";

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
     * @type string
    */
    description: string | null;
    /**
     * @type array
    */
    services: StackServiceDto[];
    /**
     * @type object
    */
    source: StackSourceDto | null;
    /**
     * @type object
    */
    destination: StackServerDto;
    /**
     * @type object
    */
    health: EntityHealthDto;
};