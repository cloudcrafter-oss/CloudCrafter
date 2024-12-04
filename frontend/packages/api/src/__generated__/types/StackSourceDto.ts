import type { StackSourceDtoType } from "./StackSourceDtoType.ts";

 export type StackSourceDto = {
    type: StackSourceDtoType;
    /**
     * @type string
    */
    gitRepository?: string | null;
    /**
     * @type string
    */
    gitPath?: string | null;
    /**
     * @type string
    */
    gitBranch?: string | null;
} | null;