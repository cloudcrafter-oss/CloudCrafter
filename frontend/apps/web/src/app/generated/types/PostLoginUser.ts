import { PostLoginUserQuery } from './PostLoginUserQuery'
import type { TokenDto } from './TokenDto'

 export type PostLoginUser200 = TokenDto;
export type PostLoginUserMutationRequest = PostLoginUserQuery;
export type PostLoginUserMutationResponse = TokenDto;
export type PostLoginUserMutation = {
    Response: PostLoginUserMutationResponse;
    Request: PostLoginUserMutationRequest;
};