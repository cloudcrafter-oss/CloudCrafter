import type { SimpleGithubProviderDto } from "./SimpleGithubProviderDto.ts";

 export type ProviderOverviewDto = {
    /**
     * @type array
    */
    github: SimpleGithubProviderDto[];
};