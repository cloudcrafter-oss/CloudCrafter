export type GetTesterQueryParams = {
    /**
     * @type integer | undefined, int32
    */
    Page?: number;
};

 /**
 * @description OK
*/
export type GetTester200 = any;

 export type GetTesterQueryResponse = GetTester200;

 export type GetTesterQuery = {
    Response: GetTester200;
    QueryParams: GetTesterQueryParams;
    Errors: any;
};