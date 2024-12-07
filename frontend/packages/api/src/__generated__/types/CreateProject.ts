import type { CreateProjectCommandCommand } from "./CreateProjectCommandCommand";
import type { ProjectDto } from "./ProjectDto";

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