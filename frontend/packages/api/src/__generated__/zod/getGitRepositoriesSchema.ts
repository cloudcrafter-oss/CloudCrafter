import { gitProviderRepositoryDtoSchema } from "./gitProviderRepositoryDtoSchema";
import { z } from "zod";

 export const getGitRepositoriesPathParamsSchema = z.object({ "id": z.string().uuid() });

 /**
 * @description OK
 */
export const getGitRepositories200Schema = z.array(z.lazy(() => gitProviderRepositoryDtoSchema));

 export const getGitRepositoriesQueryResponseSchema = z.lazy(() => getGitRepositories200Schema);