import type { GitSettings } from "./GitSettings.ts";

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
    /**
     * @type object | undefined
    */
    gitSettings?: GitSettings | null;
};