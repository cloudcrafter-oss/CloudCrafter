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
/**
 * @description OK
*/
export type UpdateProjectMutationResponse = ProjectDto;
export type UpdateProjectMutation = {
    Response: UpdateProjectMutationResponse;
    Request: UpdateProjectMutationRequest;
    PathParams: UpdateProjectPathParams;
};