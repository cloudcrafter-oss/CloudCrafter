import type { RefreshUserTokenCommand } from '../RefreshUserTokenCommand'
import type { TokenDto } from '../TokenDto'

/**
 * @description OK
 */
export type PostRefreshTokens200 = TokenDto

export type PostRefreshTokensMutationRequest = RefreshUserTokenCommand

export type PostRefreshTokensMutationResponse = PostRefreshTokens200

export type PostRefreshTokensMutation = {
  Response: PostRefreshTokens200
  Request: PostRefreshTokensMutationRequest
  Errors: any
}