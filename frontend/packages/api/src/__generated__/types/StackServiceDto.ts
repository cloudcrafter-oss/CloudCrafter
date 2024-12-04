import type { EntityHealthDto } from "./EntityHealthDto.ts";
import type { StackServiceHttpConfigurationDto } from "./StackServiceHttpConfigurationDto.ts";

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
    httpConfiguration: StackServiceHttpConfigurationDto | null;
    /**
     * @type object
    */
    health: EntityHealthDto;
};