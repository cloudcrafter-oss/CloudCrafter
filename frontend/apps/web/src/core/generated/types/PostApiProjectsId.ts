import { UpdateProjectArgs } from './UpdateProjectArgs'
import type { ProjectDto } from './ProjectDto'

 export type PostApiProjectsIdPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};
/**
 * @description OK
*/
export type PostApiProjectsId200 = ProjectDto;
export type PostApiProjectsIdMutationRequest = UpdateProjectArgs;
/**
 * @description OK
*/
export type PostApiProjectsIdMutationResponse = ProjectDto;
export type PostApiProjectsIdMutation = {
    Response: PostApiProjectsIdMutationResponse;
    Request: PostApiProjectsIdMutationRequest;
    PathParams: PostApiProjectsIdPathParams;
};