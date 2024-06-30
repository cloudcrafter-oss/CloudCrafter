import { Query } from './Query'
import type { TokenDto } from './TokenDto'

 export type PostLoginUser200 = TokenDto;
export type PostLoginUserMutationRequest = Query;
export type PostLoginUserMutationResponse = TokenDto;
export type PostLoginUserMutation = {
    Response: PostLoginUserMutationResponse;
    Request: PostLoginUserMutationRequest;
};