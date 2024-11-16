import type { EnvironmentDto } from "./EnvironmentDto";

 export type ProjectDto = {
    /**
     * @type string, uuid
    */
    id: string;
    /**
     * @type string
    */
    name: string;
    /**
     * @type string
    */
    description: string | null;
    /**
     * @type string, date-time
    */
    createdAt: string;
    /**
     * @type string, date-time
    */
    updatedAt: string;
    /**
     * @type array
    */
    environments: EnvironmentDto[];
};