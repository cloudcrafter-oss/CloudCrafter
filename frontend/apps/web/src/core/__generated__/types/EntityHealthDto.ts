import type { EntityHealthDtoValue } from "./EntityHealthDtoValue.ts";

 export type EntityHealthDto = {
    /**
     * @type string, date-time
    */
    statusAt?: string | null;
    value: EntityHealthDtoValue;
};