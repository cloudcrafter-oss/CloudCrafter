export type CreateStackFromSourceProviderCommandCommand = {
    /**
     * @type string
    */
    name: string;
    /**
     * @type string, uuid
    */
    providerId: string;
    /**
     * @type string
    */
    repositoryId: string;
    /**
     * @type string
    */
    branch: string;
    /**
     * @type string
    */
    path: string;
    /**
     * @type string, uuid
    */
    environmentId: string;
    /**
     * @type string, uuid
    */
    serverId: string;
    /**
     * @type string
    */
    repository: string;
};