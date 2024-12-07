import type { PostRefreshUserTokensQuery } from "./PostRefreshUserTokensQuery";
import type { TokenDto } from "./TokenDto";

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