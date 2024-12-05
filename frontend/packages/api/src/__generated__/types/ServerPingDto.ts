import type { ServerStatusDtoValue } from "./ServerStatusDtoValue";

 export type ServerPingDto = {
    /**
     * @type string, date-time
    */
    lastPingReceivedAt?: string | null;
    /**
     * @type string
    */
    osInfo?: string | null;
    /**
     * @type string
    */
    dockerVersion?: string | null;
    /**
     * @type number, double
    */
    cpuUsagePercentage?: number | null;
    /**
     * @type integer, int32
    */
    totalCpuCount?: number | null;
    /**
     * @type number, double
    */
    memoryUsagePercentage?: number | null;
    /**
     * @type integer, int64
    */
    totalMemoryBytes?: number | null;
    status: ServerStatusDtoValue;
};