import type { SortDirection } from "./SortDirection.ts";

 export type SortModel = {
    /**
     * @type string
    */
    field: string;
    /**
     * @type integer
    */
    direction: SortDirection;
};