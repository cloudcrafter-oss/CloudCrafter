import type { PostRefreshUserTokensQuery } from "./PostRefreshUserTokensQuery.ts";
import type { TokenDto } from "./TokenDto.ts";

 /**
 * @description OK
*/
export type PostRefreshTokens200 = TokenDto;

 export type PostRefreshTokensMutationRequest = PostRefreshUserTokensQuery;

 export type PostRefreshTokensMutationResponse = PostRefreshTokens200;

 export type PostRefreshTokensMutation = {
    Response: PostRefreshTokens200;
    Request: PostRefreshTokensMutationRequest;
    Errors: any;
};