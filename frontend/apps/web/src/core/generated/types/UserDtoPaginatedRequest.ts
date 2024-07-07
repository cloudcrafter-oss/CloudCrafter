import { FilterCriterea } from './FilterCriterea'
import { SortModel } from './SortModel'

 export type UserDtoPaginatedRequest = {
    /**
     * @type integer, int32
    */
    page: number;
    /**
     * @type integer, int32
    */
    pageSize: number;
    /**
     * @type array
    */
    filters: FilterCriterea[];
    /**
     * @type array
    */
    sortBy?: SortModel[] | null;
};