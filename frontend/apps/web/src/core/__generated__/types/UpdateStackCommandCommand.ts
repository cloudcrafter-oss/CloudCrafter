import type { UpdateStackCommandGitSettings } from "./UpdateStackCommandGitSettings";

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
     * @type object
    */
    gitSettings: UpdateStackCommandGitSettings;
};