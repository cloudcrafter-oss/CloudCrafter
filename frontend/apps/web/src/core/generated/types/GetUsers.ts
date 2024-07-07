import { UserDtoPaginatedRequest } from './UserDtoPaginatedRequest'
import type { UserDtoPaginatedList } from './UserDtoPaginatedList'

 /**
 * @description OK
*/
export type GetUsers200 = UserDtoPaginatedList;
export type GetUsersMutationRequest = UserDtoPaginatedRequest;
/**
 * @description OK
*/
export type GetUsersMutationResponse = UserDtoPaginatedList;
export type GetUsersMutation = {
    Response: GetUsersMutationResponse;
    Request: GetUsersMutationRequest;
};