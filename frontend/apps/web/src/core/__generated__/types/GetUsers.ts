import type { PaginatedListOfUserDto } from "./PaginatedListOfUserDto";
import type { PaginatedRequestOfUserDto } from "./PaginatedRequestOfUserDto";

 /**
 * @description OK
*/
export type GetUsers200 = PaginatedListOfUserDto;
export type GetUsersMutationRequest = PaginatedRequestOfUserDto;
/**
 * @description OK
*/
export type GetUsersMutationResponse = PaginatedListOfUserDto;
export type GetUsersMutation = {
    Response: GetUsersMutationResponse;
    Request: GetUsersMutationRequest;
};