import { gitProviderRepositoryDtoSchema } from "./gitProviderRepositoryDtoSchema";
import { z } from "zod";

 export const getGithubRepositoriesPathParamsSchema = z.object({ "id": z.string().uuid() });

 /**
 * @description OK
 */
export const getGithubRepositories200Schema = z.array(z.lazy(() => gitProviderRepositoryDtoSchema));

 export const getGithubRepositoriesQueryResponseSchema = z.lazy(() => getGithubRepositories200Schema);