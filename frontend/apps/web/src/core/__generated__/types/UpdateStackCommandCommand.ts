export type UpdateStackCommandCommand = {
    /**
     * @type string, uuid
    */
    stackId: string;
    /**
     * @type string
    */
    name?: string | null;
    /**
     * @type string
    */
    description?: string | null;
};