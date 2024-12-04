import type { ServerPingDto } from "./ServerPingDto.ts";

 export type ServerDto = {
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
    ipAddress: string;
    /**
     * @type object
    */
    pingData: ServerPingDto;
};