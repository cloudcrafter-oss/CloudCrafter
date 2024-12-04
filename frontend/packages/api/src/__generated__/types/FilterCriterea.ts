import type { FilterOperatorOption } from "./FilterOperatorOption.ts";

 export type FilterCriterea = {
    /**
     * @type string
    */
    propertyName: string;
    operator: FilterOperatorOption;
    /**
     * @type string
    */
    value?: string | null;
};