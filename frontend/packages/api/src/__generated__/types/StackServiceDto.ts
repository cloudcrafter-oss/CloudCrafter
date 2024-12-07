import type { EntityHealthDto } from "./EntityHealthDto";
import type { StackServiceHttpConfigurationDto } from "./StackServiceHttpConfigurationDto";

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