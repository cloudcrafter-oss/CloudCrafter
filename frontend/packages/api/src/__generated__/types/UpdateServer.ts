import type { UpdateServerDto } from "./UpdateServerDto";

 export type UpdateServerPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};

 /**
 * @description OK
*/
export type UpdateServer200 = any;

 export type UpdateServerMutationRequest = UpdateServerDto;

 export type UpdateServerMutationResponse = UpdateServer200;

 export type UpdateServerMutation = {
    Response: UpdateServer200;
    Request: UpdateServerMutationRequest;
    PathParams: UpdateServerPathParams;
    Errors: any;
};