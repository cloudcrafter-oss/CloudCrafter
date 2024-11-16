import type { PostRefreshUserTokensQuery } from "./PostRefreshUserTokensQuery.ts";
import type { TokenDto2 } from "./TokenDto2.ts";

 /**
 * @description OK
*/
export type PostRefreshTokens200 = TokenDto2;

 export type PostRefreshTokensMutationRequest = PostRefreshUserTokensQuery;

 export type PostRefreshTokensMutationResponse = PostRefreshTokens200;

 export type PostRefreshTokensMutation = {
    Response: PostRefreshTokens200;
    Request: PostRefreshTokensMutationRequest;
    Errors: any;
};