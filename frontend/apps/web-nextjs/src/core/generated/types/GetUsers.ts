import type { UserDtoPaginatedList } from './UserDtoPaginatedList'

 export type GetUsersQueryParams = {
    /**
     * @type integer | undefined, int32
    */
    Page?: number;
    /**
     * @type integer | undefined, int32
    */
    PageSize?: number;
};
/**
 * @description OK
*/
export type GetUsers200 = UserDtoPaginatedList;
/**
 * @description OK
*/
export type GetUsersQueryResponse = UserDtoPaginatedList;
export type GetUsersQuery = {
    Response: GetUsersQueryResponse;
    QueryParams: GetUsersQueryParams;
};