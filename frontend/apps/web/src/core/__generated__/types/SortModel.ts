import type { SortDirection2 } from "./SortDirection2.ts";

 export type SortModel = {
    /**
     * @type string
    */
    field: string;
    /**
     * @type integer
    */
    direction: SortDirection2;
};