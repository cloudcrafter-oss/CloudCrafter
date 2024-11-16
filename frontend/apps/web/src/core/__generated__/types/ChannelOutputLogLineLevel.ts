export const channelOutputLogLineLevelEnum = {
    "Verbose": "Verbose",
    "Debug": "Debug",
    "Information": "Information",
    "Warning": "Warning",
    "Error": "Error",
    "Fatal": "Fatal"
} as const;

 export type ChannelOutputLogLineLevelEnum = (typeof channelOutputLogLineLevelEnum)[keyof typeof channelOutputLogLineLevelEnum];

 export type ChannelOutputLogLineLevel = ChannelOutputLogLineLevelEnum;