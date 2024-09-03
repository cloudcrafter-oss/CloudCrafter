import type { TokenDto } from "./TokenDto";
import type { PostRefreshUserTokensQuery } from "./PostRefreshUserTokensQuery";

 /**
 * @description OK
*/
export type PostRefreshTokens200 = TokenDto;
export type PostRefreshTokensMutationRequest = PostRefreshUserTokensQuery;
/**
 * @description OK
*/
export type PostRefreshTokensMutationResponse = TokenDto;
export type PostRefreshTokensMutation = {
    Response: PostRefreshTokensMutationResponse;
    Request: PostRefreshTokensMutationRequest;
};