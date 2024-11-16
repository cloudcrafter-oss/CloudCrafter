import type { ServerDetailDto } from "./ServerDetailDto.ts";

 export type GetServerByIdPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};

 /**
 * @description OK
*/
export type GetServerById200 = ServerDetailDto;

 export type GetServerByIdQueryResponse = GetServerById200;

 export type GetServerByIdQuery = {
    Response: GetServerById200;
    PathParams: GetServerByIdPathParams;
    Errors: any;
};