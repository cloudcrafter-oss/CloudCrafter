import { UserDto } from './UserDto'

 export type PaginatedListOfUserDto = {
    /**
     * @type integer | undefined, int32
    */
    currentPage?: number;
    /**
     * @type integer | undefined, int32
    */
    totalPages?: number;
    /**
     * @type integer | undefined, int32
    */
    totalItems?: number;
    /**
     * @type array | undefined
    */
    result?: UserDto[];
};