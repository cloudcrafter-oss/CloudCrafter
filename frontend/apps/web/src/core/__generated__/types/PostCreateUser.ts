import type { PostCreateUserQuery } from "./PostCreateUserQuery.ts";
import type { TokenDto } from "./TokenDto.ts";

 /**
 * @description OK
*/
export type PostCreateUser200 = TokenDto;

 export type PostCreateUserMutationRequest = PostCreateUserQuery;

 export type PostCreateUserMutationResponse = PostCreateUser200;

 export type PostCreateUserMutation = {
    Response: PostCreateUser200;
    Request: PostCreateUserMutationRequest;
    Errors: any;
};