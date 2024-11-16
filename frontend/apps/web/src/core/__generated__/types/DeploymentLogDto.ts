import type { ChannelOutputLogLineLevel } from "./ChannelOutputLogLineLevel.ts";

 export type DeploymentLogDto = {
    /**
     * @type string
    */
    message: string;
    level: ChannelOutputLogLineLevel;
    /**
     * @type string, date-time
    */
    at: string;
};