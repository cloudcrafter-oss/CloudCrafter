import type { StackDetailDto } from "./StackDetailDto";

 export type GetStackDetailPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};
/**
 * @description OK
*/
export type GetStackDetail200 = StackDetailDto;
/**
 * @description Not Found
*/
export type GetStackDetail404 = any;
/**
 * @description OK
*/
export type GetStackDetailQueryResponse = StackDetailDto;
export type GetStackDetailQuery = {
    Response: GetStackDetailQueryResponse;
    PathParams: GetStackDetailPathParams;
    Errors: GetStackDetail404;
};