import type { StackDetailDto } from "./StackDetailDto.ts";
import type { UpdateStackCommandCommand2 } from "./UpdateStackCommandCommand2.ts";

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

 export type UpdateStackMutationRequest = UpdateStackCommandCommand2;

 export type UpdateStackMutationResponse = UpdateStack200;

 export type UpdateStackMutation = {
    Response: UpdateStack200;
    Request: UpdateStackMutationRequest;
    PathParams: UpdateStackPathParams;
    Errors: UpdateStack404;
};