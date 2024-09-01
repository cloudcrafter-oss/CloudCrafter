import type { ProjectDto } from "./ProjectDto";
import type { CreateProjectCommandCommand } from "./CreateProjectCommandCommand";

 /**
 * @description OK
*/
export type CreateProject200 = ProjectDto;
export type CreateProjectMutationRequest = CreateProjectCommandCommand;
/**
 * @description OK
*/
export type CreateProjectMutationResponse = ProjectDto;
export type CreateProjectMutation = {
    Response: CreateProjectMutationResponse;
    Request: CreateProjectMutationRequest;
};