import type { SimpleDeploymentDto } from "./SimpleDeploymentDto";

 export type PaginatedListOfSimpleDeploymentDto = {
    /**
     * @type integer, int32
    */
    page: number;
    /**
     * @type integer, int32
    */
    totalPages: number;
    /**
     * @type integer, int32
    */
    totalItems: number;
    /**
     * @type array
    */
    result: SimpleDeploymentDto[];
};