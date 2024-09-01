import type { StackCreatedDto } from "./StackCreatedDto";
import type { CreateStackCommandCommand } from "./CreateStackCommandCommand";

 /**
 * @description OK
*/
export type PostCreateStack200 = StackCreatedDto;
export type PostCreateStackMutationRequest = CreateStackCommandCommand;
/**
 * @description OK
*/
export type PostCreateStackMutationResponse = StackCreatedDto;
export type PostCreateStackMutation = {
    Response: PostCreateStackMutationResponse;
    Request: PostCreateStackMutationRequest;
};