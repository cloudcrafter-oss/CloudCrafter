import type { PostLoginUserQuery } from './PostLoginUserQuery'
import type { TokenDto } from './TokenDto'

/**
 * @description OK
 */
export type PostLoginUser200 = TokenDto
export type PostLoginUserMutationRequest = PostLoginUserQuery
/**
 * @description OK
 */
export type PostLoginUserMutationResponse = TokenDto
export type PostLoginUserMutation = {
	Response: PostLoginUserMutationResponse
	Request: PostLoginUserMutationRequest
}
