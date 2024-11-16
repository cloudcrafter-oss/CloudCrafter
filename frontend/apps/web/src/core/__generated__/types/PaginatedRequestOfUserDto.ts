import type { FilterCriterea } from "./FilterCriterea";
import type { SortModel } from "./SortModel";

 export type PaginatedRequestOfUserDto = {
    /**
     * @type array
    */
    filters: FilterCriterea[];
    /**
     * @type array
    */
    sortBy?: SortModel[] | null;
    /**
     * @type integer, int32
    */
    page: number;
    /**
     * @type integer, int32
    */
    pageSize: number;
};