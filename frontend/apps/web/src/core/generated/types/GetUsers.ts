import type { UserDtoPaginatedList } from './UserDtoPaginatedList'
import type { UserDtoPaginatedRequest } from './UserDtoPaginatedRequest'

/**
 * @description OK
 */
export type GetUsers200 = UserDtoPaginatedList
export type GetUsersMutationRequest = UserDtoPaginatedRequest
/**
 * @description OK
 */
export type GetUsersMutationResponse = UserDtoPaginatedList
export type GetUsersMutation = {
	Response: GetUsersMutationResponse
	Request: GetUsersMutationRequest
}
