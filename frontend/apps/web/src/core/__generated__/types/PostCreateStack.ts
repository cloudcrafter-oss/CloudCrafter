import type { CreateStackCommandCommand } from "./CreateStackCommandCommand.ts";
import type { StackCreatedDto } from "./StackCreatedDto.ts";

 /**
 * @description OK
*/
export type PostCreateStack200 = StackCreatedDto;

 export type PostCreateStackMutationRequest = CreateStackCommandCommand;

 export type PostCreateStackMutationResponse = PostCreateStack200;

 export type PostCreateStackMutation = {
    Response: PostCreateStack200;
    Request: PostCreateStackMutationRequest;
    Errors: any;
};