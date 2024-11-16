import type { PaginatedListOfUserDto } from "./PaginatedListOfUserDto.ts";
import type { PaginatedRequestOfUserDto } from "./PaginatedRequestOfUserDto.ts";

 /**
 * @description OK
*/
export type GetUsers200 = PaginatedListOfUserDto;

 export type GetUsersMutationRequest = PaginatedRequestOfUserDto;

 export type GetUsersMutationResponse = GetUsers200;

 export type GetUsersMutation = {
    Response: GetUsers200;
    Request: GetUsersMutationRequest;
    Errors: any;
};