import type { CreateStackFromSourceProviderCommandCommand } from "./CreateStackFromSourceProviderCommandCommand";
import type { StackCreatedDto } from "./StackCreatedDto";

 /**
 * @description OK
*/
export type PostCreateStackFromSourceProvider200 = StackCreatedDto;

 export type PostCreateStackFromSourceProviderMutationRequest = CreateStackFromSourceProviderCommandCommand;

 export type PostCreateStackFromSourceProviderMutationResponse = PostCreateStackFromSourceProvider200;

 export type PostCreateStackFromSourceProviderMutation = {
    Response: PostCreateStackFromSourceProvider200;
    Request: PostCreateStackFromSourceProviderMutationRequest;
    Errors: any;
};