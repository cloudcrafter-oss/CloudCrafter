import type { LoginUserCommand } from './LoginUserCommand'
import type { TokenDto } from './TokenDto'

/**
 * @description OK
 */
export type PostLoginUser200 = TokenDto

export type PostLoginUserMutationRequest = LoginUserCommand

export type PostLoginUserMutationResponse = PostLoginUser200

export type PostLoginUserMutation = {
  Response: PostLoginUser200
  Request: PostLoginUserMutationRequest
  Errors: any
}