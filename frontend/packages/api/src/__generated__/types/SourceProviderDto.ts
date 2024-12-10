import type { ProviderType } from "./ProviderType";
import type { SimpleGithubProviderDto } from "./SimpleGithubProviderDto";

 export type SourceProviderDto = {
    /**
     * @type string, uuid
    */
    id: string;
    /**
     * @type string
    */
    name: string;
    /**
     * @type object | undefined
    */
    github?: SimpleGithubProviderDto | null;
    type: ProviderType;
};