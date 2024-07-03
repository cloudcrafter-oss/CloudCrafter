import { UserDto } from './UserDto'

 export type UserDtoPaginatedList = {
    /**
     * @type integer, int32
    */
    currentPage: number;
    /**
     * @type integer, int32
    */
    totalPages: number;
    /**
     * @type integer, int32
    */
    totalItems: number;
    /**
     * @type array
    */
    result: UserDto[];
};