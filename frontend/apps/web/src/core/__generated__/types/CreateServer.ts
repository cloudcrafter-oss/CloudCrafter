import type { CreatedServerDto } from "./CreatedServerDto.ts";
import type { CreateServerCommandCommand } from "./CreateServerCommandCommand.ts";

 /**
 * @description OK
*/
export type CreateServer200 = CreatedServerDto;

 export type CreateServerMutationRequest = CreateServerCommandCommand;

 export type CreateServerMutationResponse = CreateServer200;

 export type CreateServerMutation = {
    Response: CreateServer200;
    Request: CreateServerMutationRequest;
    Errors: any;
};