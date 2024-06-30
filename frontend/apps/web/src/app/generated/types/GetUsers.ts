import type { UserDto } from './UserDto'

 export type GetUsers200 = UserDto[];
export type GetUsersQueryResponse = UserDto[];
export type GetUsersQuery = {
    Response: GetUsersQueryResponse;
};