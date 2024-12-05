import type { ProjectDto } from "./ProjectDto";
import type { UpdateProjectArgs } from "./UpdateProjectArgs";

 export type UpdateProjectPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};

 /**
 * @description OK
*/
export type UpdateProject200 = ProjectDto;

 export type UpdateProjectMutationRequest = UpdateProjectArgs;

 export type UpdateProjectMutationResponse = UpdateProject200;

 export type UpdateProjectMutation = {
    Response: UpdateProject200;
    Request: UpdateProjectMutationRequest;
    PathParams: UpdateProjectPathParams;
    Errors: any;
};