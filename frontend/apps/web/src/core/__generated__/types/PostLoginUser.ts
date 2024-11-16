import type { PostLoginUserQuery } from "./PostLoginUserQuery.ts";
import type { TokenDto2 } from "./TokenDto2.ts";

 /**
 * @description OK
*/
export type PostLoginUser200 = TokenDto2;

 export type PostLoginUserMutationRequest = PostLoginUserQuery;

 export type PostLoginUserMutationResponse = PostLoginUser200;

 export type PostLoginUserMutation = {
    Response: PostLoginUser200;
    Request: PostLoginUserMutationRequest;
    Errors: any;
};