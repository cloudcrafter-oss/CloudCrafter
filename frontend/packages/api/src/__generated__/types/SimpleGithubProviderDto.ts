export type SimpleGithubProviderDto = {
    /**
     * @type string, uuid
    */
    id: string;
    /**
     * @type string
    */
    name: string;
    /**
     * @type boolean
    */
    isConnected: boolean | null;
    /**
     * @type string, date-time
    */
    createdAt: string;
};