export type CreateStackCommandCommand = {
    /**
     * @type string
    */
    name: string;
    /**
     * @type string
    */
    gitRepository: string;
    /**
     * @type string, uuid
    */
    environmentId: string;
    /**
     * @type string, uuid
    */
    serverId: string;
};