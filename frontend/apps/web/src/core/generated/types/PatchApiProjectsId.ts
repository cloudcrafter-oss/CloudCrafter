import { UpdateProjectPatchArgs } from './UpdateProjectPatchArgs'
import type { ProjectDto } from './ProjectDto'

 export type PatchApiProjectsIdPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};
/**
 * @description OK
*/
export type PatchApiProjectsId200 = ProjectDto;
export type PatchApiProjectsIdMutationRequest = UpdateProjectPatchArgs;
/**
 * @description OK
*/
export type PatchApiProjectsIdMutationResponse = ProjectDto;
export type PatchApiProjectsIdMutation = {
    Response: PatchApiProjectsIdMutationResponse;
    Request: PatchApiProjectsIdMutationRequest;
    PathParams: PatchApiProjectsIdPathParams;
};