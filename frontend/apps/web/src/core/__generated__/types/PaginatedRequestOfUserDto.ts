import type { FilterCriterea } from "./FilterCriterea.ts";
import type { SortModel } from "./SortModel.ts";

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