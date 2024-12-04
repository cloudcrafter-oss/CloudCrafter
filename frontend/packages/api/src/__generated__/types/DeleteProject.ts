export type DeleteProjectPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};

 /**
 * @description OK
*/
export type DeleteProject200 = any;

 export type DeleteProjectMutationResponse = DeleteProject200;

 export type DeleteProjectMutation = {
    Response: DeleteProject200;
    PathParams: DeleteProjectPathParams;
    Errors: any;
};