export type UpdateStackServiceCommandCommand = {
    /**
     * @type string, uuid
    */
    stackId: string;
    /**
     * @type string, uuid
    */
    stackServiceId: string;
    /**
     * @type string
    */
    name?: string | null;
    /**
     * @type string
    */
    domainName?: string | null;
};