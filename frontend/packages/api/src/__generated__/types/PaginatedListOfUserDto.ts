import type { UserDto } from "./UserDto.ts";

 export type PaginatedListOfUserDto = {
    /**
     * @type integer, int32
    */
    page: number;
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