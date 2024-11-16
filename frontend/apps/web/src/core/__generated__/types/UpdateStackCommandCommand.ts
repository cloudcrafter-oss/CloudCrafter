import type { GitSettings } from "./GitSettings.ts";

 export type UpdateStackCommandCommand = {
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