import { Query } from './Query'
import type { TokenDto } from './TokenDto'

 /**
 * @description OK
*/
export type PostLoginUser200 = TokenDto;
export type PostLoginUserMutationRequest = Query;
/**
 * @description OK
*/
export type PostLoginUserMutationResponse = TokenDto;
export type PostLoginUserMutation = {
    Response: PostLoginUserMutationResponse;
    Request: PostLoginUserMutationRequest;
};