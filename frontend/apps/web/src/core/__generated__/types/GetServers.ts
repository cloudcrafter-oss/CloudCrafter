import type { ServerDto } from "./ServerDto";

 /**
 * @description OK
*/
export type GetServers200 = ServerDto[];
/**
 * @description OK
*/
export type GetServersQueryResponse = ServerDto[];
export type GetServersQuery = {
    Response: GetServersQueryResponse;
};