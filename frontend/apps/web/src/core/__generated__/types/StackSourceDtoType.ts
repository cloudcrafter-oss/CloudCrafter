export const stackSourceDtoTypeEnum = {
    "Git": "Git",
    "GitSsh": "GitSsh"
} as const;

 export type StackSourceDtoTypeEnum = (typeof stackSourceDtoTypeEnum)[keyof typeof stackSourceDtoTypeEnum];

 export type StackSourceDtoType = StackSourceDtoTypeEnum;