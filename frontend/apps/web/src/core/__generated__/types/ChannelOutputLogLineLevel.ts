export const channelOutputLogLineLevel = {
    "Verbose": "Verbose",
    "Debug": "Debug",
    "Information": "Information",
    "Warning": "Warning",
    "Error": "Error",
    "Fatal": "Fatal"
} as const;
export type ChannelOutputLogLineLevel = (typeof channelOutputLogLineLevel)[keyof typeof channelOutputLogLineLevel];