import type { TokenDto } from "./TokenDto";
import type { PostLoginUserQuery } from "./PostLoginUserQuery";

 /**
 * @description OK
*/
export type PostLoginUser200 = TokenDto;
export type PostLoginUserMutationRequest = PostLoginUserQuery;
/**
 * @description OK
*/
export type PostLoginUserMutationResponse = TokenDto;
export type PostLoginUserMutation = {
    Response: PostLoginUserMutationResponse;
    Request: PostLoginUserMutationRequest;
};