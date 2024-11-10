import type { StackDetailDto } from "./StackDetailDto";
import type { UpdateStackCommandCommand } from "./UpdateStackCommandCommand";

 export type UpdateStackPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};
/**
 * @description OK
*/
export type UpdateStack200 = StackDetailDto;
/**
 * @description Not Found
*/
export type UpdateStack404 = any;
export type UpdateStackMutationRequest = UpdateStackCommandCommand;
/**
 * @description OK
*/
export type UpdateStackMutationResponse = StackDetailDto;
export type UpdateStackMutation = {
    Response: UpdateStackMutationResponse;
    Request: UpdateStackMutationRequest;
    PathParams: UpdateStackPathParams;
    Errors: UpdateStack404;
};