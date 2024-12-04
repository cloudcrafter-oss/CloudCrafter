import type { PostLoginUserQuery } from "./PostLoginUserQuery.ts";
import type { TokenDto } from "./TokenDto.ts";

 /**
 * @description OK
*/
export type PostLoginUser200 = TokenDto;

 export type PostLoginUserMutationRequest = PostLoginUserQuery;

 export type PostLoginUserMutationResponse = PostLoginUser200;

 export type PostLoginUserMutation = {
    Response: PostLoginUser200;
    Request: PostLoginUserMutationRequest;
    Errors: any;
};