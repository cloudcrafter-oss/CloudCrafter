import { gitProviderBranchDtoSchema } from "./gitProviderBranchDtoSchema";
import { z } from "zod";

 export const getGitBranchesPathParamsSchema = z.object({ "id": z.string().uuid(), "repositoryId": z.string() });

 /**
 * @description OK
 */
export const getGitBranches200Schema = z.array(z.lazy(() => gitProviderBranchDtoSchema));

 export const getGitBranchesQueryResponseSchema = z.lazy(() => getGitBranches200Schema);