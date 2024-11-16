import type { CreateProjectCommandCommand } from "./CreateProjectCommandCommand.ts";
import type { ProjectDto } from "./ProjectDto.ts";

 /**
 * @description OK
*/
export type CreateProject200 = ProjectDto;

 export type CreateProjectMutationRequest = CreateProjectCommandCommand;

 export type CreateProjectMutationResponse = CreateProject200;

 export type CreateProjectMutation = {
    Response: CreateProject200;
    Request: CreateProjectMutationRequest;
    Errors: any;
};