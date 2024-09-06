export const stackSourceDtoType = {
    "Git": "Git",
    "GitSsh": "GitSsh"
} as const;
export type StackSourceDtoType = (typeof stackSourceDtoType)[keyof typeof stackSourceDtoType];