import type { GitSettings } from "./GitSettings.ts";

 export type UpdateStackCommandCommand2 = {
    /**
     * @type string, uuid
    */
    stackId: string;
    /**
     * @default null
     * @type string
    */
    name?: string | null;
    /**
     * @default null
     * @type string
    */
    description?: string | null;
    /**
     * @type object | undefined
    */
    gitSettings?: GitSettings | null;
};