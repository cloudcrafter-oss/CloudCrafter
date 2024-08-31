import type { PostCreateUserQuery } from './PostCreateUserQuery'
import type { TokenDto } from './TokenDto'

/**
 * @description OK
 */
export type PostCreateUser200 = TokenDto
export type PostCreateUserMutationRequest = PostCreateUserQuery
/**
 * @description OK
 */
export type PostCreateUserMutationResponse = TokenDto
export type PostCreateUserMutation = {
	Response: PostCreateUserMutationResponse
	Request: PostCreateUserMutationRequest
}
