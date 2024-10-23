export type DeploymentLogDto = {
    /**
     * @type string
    */
    message: string;
    /**
     * @type boolean
    */
    isError: boolean;
    /**
     * @type string, date-time
    */
    at: string;
};