import type { PaginatedListOfUserDto } from './PaginatedListOfUserDto'

 export type GetUsersQueryParams = {
    /**
     * @type integer, int32
    */
    Page?: number | null;
    /**
     * @type integer, int32
    */
    PageSize?: number | null;
};
export type GetUsers200 = PaginatedListOfUserDto;
export type GetUsersQueryResponse = PaginatedListOfUserDto;
export type GetUsersQuery = {
    Response: GetUsersQueryResponse;
    QueryParams: GetUsersQueryParams;
};