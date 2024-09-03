import type { StackServiceDto } from "./StackServiceDto";
import type { StackSourceDto } from "./StackSourceDto";
import type { StackServerDto } from "./StackServerDto";

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
    source: StackSourceDto;
    destination: StackServerDto;
};