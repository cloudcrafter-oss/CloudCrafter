import type { PostCreateUserQuery } from "./PostCreateUserQuery.ts";
import type { TokenDto2 } from "./TokenDto2.ts";

 /**
 * @description OK
*/
export type PostCreateUser200 = TokenDto2;

 export type PostCreateUserMutationRequest = PostCreateUserQuery;

 export type PostCreateUserMutationResponse = PostCreateUser200;

 export type PostCreateUserMutation = {
    Response: PostCreateUser200;
    Request: PostCreateUserMutationRequest;
    Errors: any;
};