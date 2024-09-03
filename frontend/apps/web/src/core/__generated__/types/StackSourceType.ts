export const stackSourceType = {
    "Git": "Git",
    "GitSsh": "GitSsh"
} as const;
export type StackSourceType = (typeof stackSourceType)[keyof typeof stackSourceType];