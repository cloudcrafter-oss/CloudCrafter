import type { StackSourceDtoType } from "./StackSourceDtoType";

 export type StackSourceDto = {
    /**
     * @type string
    */
    type: StackSourceDtoType;
    /**
     * @type string
    */
    gitRepository?: string | null;
};